import { ApiProperty } from '@nestjs/swagger';

export class PaymentRequestDto{

  @ApiProperty()
  amount: number;

  @ApiProperty()
  currency: string;

  @ApiProperty()
  eventId: number;

  userId: number;
}