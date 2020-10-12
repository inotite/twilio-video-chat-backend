import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Event } from '../../../event/entity/events.entity';
import { PaymentStatus } from '../../../enums/payment-status';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class ApprovePayment {

  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ enum: PaymentStatus, enumName: 'PaymentStatus' })
  @Column({ default: PaymentStatus.PENDING })
  status: PaymentStatus;

  @ApiProperty()
  @Column({ nullable: true })
  remark: string;

  @OneToOne(type => Event, event => event.approvePayment, { eager: true })
  @JoinColumn()
  event: Event;
}