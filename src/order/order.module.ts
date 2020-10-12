import { HttpModule, Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entity/order.entity';
import { PurchaseUnits } from './entity/purchase-unit.entity';
import { EventModule } from '../event/event.module';
import { SubscriberModule } from '../subscriber/subscriber.module';
import { PaymentModule } from '../payment/payment.module';
import { BillingModule } from '../billing/billing.module';

@Module({
  imports: [HttpModule, PaymentModule, EventModule, SubscriberModule, BillingModule, TypeOrmModule.forFeature([Order, PurchaseUnits])],
  providers: [OrderService],
  controllers: [OrderController],
  exports: [OrderService]
})
export class OrderModule {}
