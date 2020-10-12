import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventModule } from './event/event.module';
import { BillingModule } from './billing/billing.module';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { PaymentModule } from './payment/payment.module';
import { ConfigModule } from '@nestjs/config';
import { VideoModule } from './video/video.module';
import { SubscriberModule } from './subscriber/subscriber.module';
import { OrderModule } from './order/order.module';
import { SendGridModule } from '@ntegral/nestjs-sendgrid';
import { PaymentsModule } from './admin/payments/payments.module';

@Module({
  imports: [
    SendGridModule.forRoot({
      apiKey: "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",
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(),
    AuthModule,
    UserModule,
    EventModule,
    BillingModule,
    PaymentModule,
    VideoModule,
    SubscriberModule,
    OrderModule,
    PaymentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('*');
  }
}
