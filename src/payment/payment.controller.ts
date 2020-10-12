import { Body, Controller, Get, Param, Post, Request, UseGuards } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PaymentDetails } from './entity/payment-details.entity';
import { PaymentRequestDto } from './dto/payment-request.dto';
import { Payment } from './entity/payment.entity';

@Controller('payment')
export class PaymentController {
  constructor(private paymentService: PaymentService) {
  }

  @UseGuards(JwtAuthGuard)
  @Post('details')
  async initPayment(@Request() req, @Body() paymentDetails: PaymentDetails): Promise<any> {
    return await this.paymentService.savePaymentDetails(paymentDetails, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('payouts')
  async requestPayout(@Body() paymentRequestDto: PaymentRequestDto, @Request() req) {
    paymentRequestDto.userId = req.user.userId;
    return await this.paymentService.payPalPayoutRequest(paymentRequestDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('confirm/payouts/:eventId')
  async confirmPayouts(@Request() req, @Param('eventId') eventId: number) {
    return await this.paymentService.confirmPayouts(req.user.userId, eventId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('payout/amount')
  async getPaymentsPayoutBalance(@Request() req): Promise<Payment> {
    return await this.paymentService.getPayments(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('payment-details')
  async getPaymentDetails(@Request() req): Promise<PaymentDetails> {
    return await this.paymentService.getPaymentDetails(req.user.userId);
  }
}
