import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApprovePayment } from './entity/approve-payment.entity';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('approve-payments')
export class PaymentsController {

  constructor(private paymentsService: PaymentsService) {
  }


  @Get()
  @UseGuards(JwtAuthGuard)
  async findAllApprovalPayments(): Promise<ApprovePayment[]> {
    return await this.paymentsService.findAllPaymentRequests();
  }
}
