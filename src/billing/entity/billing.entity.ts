import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Audit } from 'src/commons/entity/audit.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Event } from 'src/event/entity/events.entity';
import { PaymentStatus } from '../../enums/payment-status';

@Entity()
export class Billing extends Audit {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @ApiProperty()
  eventId: number;

  @Column({ default: 0.00 })
  @ApiProperty()
  eventPrice: number;

  @Column({ default: 0.00 })
  withdrwalRequest: number;

  @Column({ default: 0.00 })
  previousWithdrwalRequest: number;

  @Column({ default: 0.00 })
  @ApiProperty()
  withdrawnAmount: number;

  @Column({ default: 0.00 })
  @ApiProperty()
  balance: number;

  @Column({ default: PaymentStatus.PENDING })
  @ApiProperty({ enum: PaymentStatus, enumName: 'PaymentStatus' })
  status: PaymentStatus;

  @OneToOne(type => Event, event => event.billing)
  @JoinColumn({ name: 'eventId' })
  event: Event;

}