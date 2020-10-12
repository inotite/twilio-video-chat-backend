import { HttpException, HttpService, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from './entity/payment.entity';
import { Repository } from 'typeorm';
import * as qs from 'qs';
import { PaymentDetails } from './entity/payment-details.entity';
import { PaymentRequestDto } from './dto/payment-request.dto';
import { User } from '../user/entity/user.entity';
import { Amount, Item, PayoutsDto, SenderBatchHeader } from './dto/payouts.dto';
import { PaymentsService } from '../admin/payments/payments.service';
import { EventService } from '../event/event.service';
import { Event } from '../event/entity/events.entity';
import { ApprovePayment } from '../admin/payments/entity/approve-payment.entity';
import { BillingService } from '../billing/billing.service';
import { PaymentStatus } from '../enums/payment-status';

@Injectable()
export class PaymentService {
  constructor(@InjectRepository(Payment) private paymentRepository: Repository<Payment>,
              @InjectRepository(PaymentDetails) private paymentDetailsRepository: Repository<PaymentDetails>,
              private approvePaymentService: PaymentsService,
              private eventService: EventService,
              private billingService: BillingService,
              private httpService: HttpService,
  ) {

  }

  async savePaymentDetails(paymentDetails: PaymentDetails, userId: number): Promise<PaymentDetails> {

    const details = await this.getPaymentDetails(userId);

    if (details) {
      details.paymentEmail = paymentDetails.paymentEmail;
      return this.paymentDetailsRepository.save(paymentDetails);
    }
    const user = new User();
    user.id = userId;
    paymentDetails.user = user;
    return this.paymentDetailsRepository.save(paymentDetails);
  }

  async getPaymentDetails(userId: number): Promise<PaymentDetails> {
    const user = new User();
    user.id = userId;
    return this.paymentDetailsRepository.findOne({ where: { user: user } });
  }

  async getPayments(userId: number): Promise<Payment> {
    return await this.paymentRepository.findOne({ where: { userId: userId } });
  }

  async savePayments(payment: Payment): Promise<Payment> {
    if (!payment.paymentEmail) {
      const paymentDetails = await this.getPaymentDetails(payment.userId);
      payment.paymentEmail = paymentDetails.paymentEmail;
      // payment.paymentEmail = "mbuguanjane2005-buyer@gmail.com"
    }
    return await this.paymentRepository.save(payment);
  }

  async payPalPayoutRequest(paymentRequestDto: PaymentRequestDto) {
    const paymentDetails = await this.getPaymentDetails(paymentRequestDto.userId);
    const event = await this.eventService.findById(paymentRequestDto.eventId);

    if (paymentRequestDto.amount > event.price) {
      throw new HttpException({
          error: 'Payment could not be completed due to insufficient funds',
          status: HttpStatus.BAD_REQUEST,
          timestamp: new Date().toISOString(),
          path: '/payment/payout',
        },
        HttpStatus.BAD_REQUEST);
    }
    if (paymentRequestDto.amount > event.billing.balance) {
      throw new HttpException({
          error: 'Payment could not be completed due to insufficient funds',
          status: HttpStatus.BAD_REQUEST,
          timestamp: new Date().toISOString(),
          path: '/payment/payout',
        },
        HttpStatus.BAD_REQUEST);
    }

    const paymentItem = new Item();
    paymentItem.amount = new Amount(paymentRequestDto.amount, 'USD');
    paymentItem.receiver = paymentDetails.paymentEmail;
    // eslint-disable-next-line @typescript-eslint/camelcase
    paymentItem.sender_item_id = 'SENDER_' + paymentRequestDto.userId;

    const payout = new PayoutsDto();
    const senderBatchHeader = new SenderBatchHeader();
    // eslint-disable-next-line @typescript-eslint/camelcase
    senderBatchHeader.sender_batch_id = 'JoinARoom_' + new Date().getFullYear() + paymentRequestDto.userId + new Date().getTime();
    // eslint-disable-next-line @typescript-eslint/camelcase
    payout.sender_batch_header = senderBatchHeader;
    payout.items.push(paymentItem);

    const response = await this.requestPaypalToken().toPromise();
    const auth = 'Bearer ' + response.data.access_token;
    const url = process.env.PAYPAL_URL + process.env.PAYOUTS;

    let paymentRes = null;
    return this.httpService.post(url, payout, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': auth,
      },
    }).toPromise()
      .then(response => {
        return this.getPayments(paymentRequestDto.userId)
          .then(payment => {
            if (payment) {
              payment.payoutBatchId = response.data.batch_header.payout_batch_id;
              paymentRes = this.savePayments(payment);

              this.recordPaymentRequest(paymentRequestDto, event);

              return paymentRes;
            } else {
              return null;
            }
          });

      }).catch(error => {
        console.log(error);
        throw new HttpException({
            error: error.message,
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            timestamp: new Date().toISOString(),
            path: '/payment/payout',
          },
          HttpStatus.INTERNAL_SERVER_ERROR);
      });

  }

  async confirmPayouts(userId: number, eventId: number): Promise<any> {
    const event = await this.eventService.findById(eventId);
    const payment = await this.getPayments(event.user.id);
    const response = await this.requestPaypalToken().toPromise();
    const auth = 'Bearer ' + response.data.access_token;
    const url = process.env.PAYPAL_URL + process.env.CONFIRM_PAYOUTS + payment.payoutBatchId;

    return this.httpService.get(url, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': auth,
      },
    }).toPromise().then(response => {
      return this.getPayments(userId)
        .then(payment => {
          payment.balance = (payment.grossAmount - parseFloat(response.data.batch_header.amount.value));
          payment.grossAmount -= parseFloat(response.data.batch_header.amount.value);
          payment.payPalFee += parseFloat(response.data.batch_header.fees.value);
          payment.netAmount = (parseFloat(response.data.batch_header.amount.value) - parseFloat(response.data.batch_header.fees.value));
          payment.totalPaid += parseFloat(response.data.batch_header.amount.value);
          this.updateApprovedPayment(event, response.data.batch_header.amount.value);
          return this.savePayments(payment);
        }).catch(error => {
          throw new HttpException({
              error: error.message,
              status: HttpStatus.INTERNAL_SERVER_ERROR,
              timestamp: new Date().toISOString(),
              path: '/payout/confirm-payout',
            },
            HttpStatus.INTERNAL_SERVER_ERROR);
        });
    });
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


  async recordPaymentRequest(paymentRequestDto: PaymentRequestDto, event: Event) {
    const approvalRequest = new ApprovePayment();
    const billing = event.billing;
    approvalRequest.event = event;
    billing.withdrwalRequest = paymentRequestDto.amount;
    await this.approvePaymentService.savePaymentRequests(approvalRequest);
    await this.billingService.saveBilling(billing);
  }

  async updateApprovedPayment(event: Event, withdrawnAmount: string) {
    const approvalRequest = await this.approvePaymentService.findPaymentRequestByEventId(event.id);

    const billing = event.billing;
    approvalRequest.status = PaymentStatus.PAID;

    billing.previousWithdrwalRequest = billing.withdrwalRequest;
    billing.withdrwalRequest = 0.00;
    billing.balance = (billing.eventPrice - parseFloat(withdrawnAmount));
    billing.previousWithdrwalRequest = parseFloat(withdrawnAmount);
    billing.status = PaymentStatus.PAID;
    await this.approvePaymentService.savePaymentRequests(approvalRequest);
    await this.billingService.saveBilling(billing);
  }

}
