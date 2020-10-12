import { HttpException, HttpService, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SubscriberService } from '../subscriber/subscriber.service';
import { Amount, Link, OrdersResponse, PaypalOrder, PurchaseUnit } from './dto/paypal-order';
import { Subscriber } from '../subscriber/entity/subscriber.entity';
import * as qs from 'qs';
import { Order } from './entity/order.entity';
import { EventService } from '../event/event.service';
import { PurchaseUnits } from './entity/purchase-unit.entity';
import { PaymentService } from '../payment/payment.service';
import { Payment } from '../payment/entity/payment.entity';
import { Billing } from '../billing/entity/billing.entity';
import { Event } from '../event/entity/events.entity';
import { BillingService } from '../billing/billing.service';

@Injectable()
export class OrderService {

  constructor(@InjectRepository(Order) private orderRepository: Repository<Order>,
              @InjectRepository(PurchaseUnits) private purchaseUnitRepository: Repository<PurchaseUnits>,
              private httpService: HttpService,
              private eventService: EventService,
              private paymentService: PaymentService,
              private subscriberService: SubscriberService,
              private billingService: BillingService,
  ) {
  }

  /**
   * Initialize payment by capturing payment details and checking out order on paypal
   * @param order
   */
  async initPayment(order: Order) {

    order = await this.orderRepository.save(order);

    const event = await this.eventService.findById(order.eventId);

    const response = await this.requestPaypalToken().toPromise();
    // eslint-disable-next-line @typescript-eslint/camelcase
    const access_token = response.data.access_token;
    const paypalOrder = new PaypalOrder();
    const purchaseUnit = new PurchaseUnit();
    const amount = new Amount();

    // eslint-disable-next-line @typescript-eslint/camelcase
    amount.currency_code = 'USD';
    purchaseUnit.amount = amount;
    amount.value = event.price.toString();
    paypalOrder.purchase_units.push(purchaseUnit);

    const orderResponse = this.checkoutOrder(paypalOrder, access_token);
    order.paypalOrderId = (await orderResponse).id;
    order = await this.orderRepository.save(order);

    const link: Link = (await orderResponse).links.filter(
      link => link.rel === 'approve',
    ).pop();

    order.approvalUrl = link.href;

    return order;

  }


  async getOrderById(orderId: number): Promise<Order> {
    return this.orderRepository.findOne(orderId);
  }


  /**
   * Get an authorization token from paypal to use in subsequent requests
   */
  private requestPaypalToken() {
    const auth = 'Basic ' + Buffer.from(process.env.CLIENT_ID + ':' + process.env.CLIENT_SECRET).toString('base64');
    return this.httpService.post(process.env.PAYPAL_URL + process.env.GET_TOKEN_URL, qs.stringify({
      'grant_type': 'client_credentials',
    }), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': auth,
      },
    });

  }

  /**
   *  Checkout order to paypal for client links to approve payments
   * @param paypalOrder
   * @param access_token
   */
  // eslint-disable-next-line @typescript-eslint/camelcase
  async checkoutOrder(paypalOrder: PaypalOrder, access_token: string): Promise<OrdersResponse> {

    // eslint-disable-next-line @typescript-eslint/camelcase
    const auth = 'Bearer ' + access_token;
    return this.httpService.post(process.env.PAYPAL_URL + process.env.CHECKOUT_ORDERS, paypalOrder, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': auth,
      },
    }).toPromise().then(response => {
      return response.data;
    });
  }


  async confirmPayments(orderId: string): Promise<Order> {
    const response = await this.requestPaypalToken().toPromise();
    const auth = 'Bearer ' + response.data.access_token;
    const url = process.env.PAYPAL_URL + process.env.CHECKOUT_ORDERS + orderId + '/capture';

    return this.httpService.post(url, {}, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': auth,
        'PayPal-Request-Id': orderId,
      },
    }).toPromise()
      .then(response => {
        this.orderRepository.findOne({ where: { paypalOrderId: response.data.id } })
          .then(order => {
            order.payerId = response.data.payer.payer_id;
            order.email = response.data.payer.email_address;
            order.surname = response.data.payer.surname;
            order.name = response.data.payer.given_name;
            order.status = response.data.status;
            this.orderRepository.save(order)
              .then(order => {

                const purchaseUnits = [];

                response.data.purchase_units.forEach(unit => {
                  const purchaseUnit = new PurchaseUnits();
                  unit.payments.captures.forEach(payment => {

                    purchaseUnit.amount = parseFloat(payment.amount.value);
                    purchaseUnit.currencyCode = payment.amount.currency_code;
                    purchaseUnit.grossAmount = payment.seller_receivable_breakdown.gross_amount.value;
                    purchaseUnit.payPalFee = payment.seller_receivable_breakdown.paypal_fee.value;
                    purchaseUnit.netAmount = payment.seller_receivable_breakdown.net_amount.value;
                    purchaseUnit.captureId = payment.id;
                    purchaseUnit.addressLine1 = unit.shipping.address.address_line_1;
                    purchaseUnit.addressLine2 = unit.shipping.address.address_line_2;
                    purchaseUnit.adminArea1 = unit.shipping.address.admin_area_1;
                    purchaseUnit.adminArea2 = unit.shipping.address.admin_area_2;
                    purchaseUnit.postalCode = unit.shipping.address.postal_code;
                    purchaseUnit.countryCode = unit.shipping.address.country_code;
                    purchaseUnit.status = payment.status;
                    purchaseUnit.order = order;
                    this.purchaseUnitRepository.save(purchaseUnit);
                    console.log('Purchase units saved');
                    purchaseUnits.push(purchaseUnit);
                  });
                });
                const subscriber = new Subscriber();
                subscriber.eventId = order.eventId;
                subscriber.userId = order.userId;
                subscriber.subscriptionDate = new Date().getTime().toString();

                this.subscriberService.saveNewSubscription(subscriber).then(sub => console.log('Subscriber saved'));

                order.purchaseUnits = purchaseUnits;

                this.getOrderById(order.id).then(order => {
                  this.updatePayments(order);
                });

              }).catch(error => {
              throw new HttpException({
                status: HttpStatus.BAD_REQUEST,
                error: 'Data formatted wrongly, please correct and try again',
                timestamp: new Date().toISOString(),
                path: '/order/confirm-payment',
              }, HttpStatus.BAD_REQUEST);
            });

          }).catch(error => {
          throw new HttpException({
            status: HttpStatus.BAD_REQUEST,
            error: 'Data formatted wrongly, please correct and try again',
            timestamp: new Date().toISOString(),
            path: '/order/confirm-payment',
          }, HttpStatus.BAD_REQUEST);
        });
        return Promise.resolve(this.orderRepository.findOne({ where: { paypalOrderId: response.data.id } }));
      }).catch(error => {
        console.log(error.message);
        throw new HttpException({
            error: error.message,
            status: HttpStatus.UNPROCESSABLE_ENTITY,
            timestamp: new Date().toISOString(),
            path: '/order/confirm-payment',
          },
          HttpStatus.UNPROCESSABLE_ENTITY);
      });

  }


  async updatePayments(order: Order): Promise<Payment> {
    const event = await this.eventService.findById(order.eventId);
    let payments = await this.paymentService.getPayments(event.user.id);
    const purchaseUnits = await this.getOrderPurchaseUnits(order);
    console.log('Purchase unit: ' + purchaseUnits[0].amount);

    if (payments && payments.creditOrDebit == 'C') {
      purchaseUnits.forEach(unit => {
        payments.grossAmount += unit.amount;
      });
      payments.userId = event.user.id;
      const res = await this.paymentService.savePayments(payments);
      console.log(JSON.stringify(res));
      await this.updateEventBilling(purchaseUnits, event)
      return res;
    } else {
      payments = new Payment();
      payments.grossAmount = 0;
      purchaseUnits.forEach(unit => {
        payments.grossAmount += unit.amount;
      });
      payments.userId = event.user.id;
      const res = await this.paymentService.savePayments(payments);
      console.log(JSON.stringify(res));
      await this.updateEventBilling(purchaseUnits, event)
      return res;
    }
  }

  async getOrderPurchaseUnits(order: Order): Promise<PurchaseUnits[]> {
    return this.purchaseUnitRepository.find({ where: { order: order } });
  }

  async getAllOrders(): Promise<Order[]> {
    return this.orderRepository.find();
  }

  async updateEventBilling(purchaseUnits: PurchaseUnits[], event: Event) {
    let billing: Billing;

    if (event.billing == null) {
      billing = new Billing();
      billing.eventPrice = event.price;
      billing.eventId = event.id;
      billing.balance = 0
    } else {
      billing = event.billing;
    }

    console.log(purchaseUnits);

    purchaseUnits.forEach(unit => {
      billing.balance += unit.amount;
    });

    console.log(billing);

    return await this.billingService.saveBilling(billing);
  }
}
