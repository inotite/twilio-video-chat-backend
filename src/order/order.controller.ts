import { Body, Controller, Get, Param, Post, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OrderService } from './order.service';
import { Order } from './entity/order.entity';

@Controller('order')
export class OrderController {

  constructor(private orderService: OrderService) {
  }
  @UseGuards(JwtAuthGuard)
  @Post('pay')
  async initPayment(@Request() req, @Body() order: Order): Promise<any>{
    order.email = req.user.email;
    order.userId = req.user.userId;
    return await this.orderService.initPayment(order);
  }

  @UseGuards(JwtAuthGuard)
  @Get("/confirm-payment/:order_id")
  async confirmPayment(@Param("order_id") orderId: string): Promise<Order>{
    return await this.orderService.confirmPayments(orderId);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllOrders(): Promise<Order[]>{
    return await this.orderService.getAllOrders();
  }
}
