import { Module } from '@nestjs/common';
import { BillingService } from './billing.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Billing } from './entity/billing.entity';
import { BillingController } from './billing.controller';
import { PassportModule } from '@nestjs/passport';
import { EventModule } from '../event/event.module';

@Module({
  imports: [TypeOrmModule.forFeature([Billing]), PassportModule, EventModule],
  providers: [BillingService],
  controllers: [BillingController],
  exports: [BillingService],
})
export class BillingModule {
}
