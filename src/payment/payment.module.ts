import { HttpModule, Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './entity/payment.entity';
import { PassportModule } from '@nestjs/passport';
import { SubscriberModule } from 'src/subscriber/subscriber.module';
import { PaymentDetails } from './entity/payment-details.entity';
import { PaymentsModule } from '../admin/payments/payments.module';
import { EventModule } from '../event/event.module';
import { BillingModule } from '../billing/billing.module';

@Module({
  imports: [HttpModule,
    TypeOrmModule.forFeature([Payment, PaymentDetails]),
    PassportModule,
    PaymentsModule,
    EventModule,
    BillingModule,
    SubscriberModule],
  controllers: [PaymentController],
  providers: [PaymentService],
  exports: [PaymentService],
})
export class PaymentModule {
}
