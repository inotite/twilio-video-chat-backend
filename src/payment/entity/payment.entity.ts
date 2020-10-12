import { Column, Entity, JoinColumn, Long, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Audit } from '../../commons/entity/audit.entity';
import { PaymentDetails } from './payment-details.entity';

@Entity()
export class Payment extends Audit{

  @PrimaryGeneratedColumn()
  id: Long;

  @ApiProperty()
  @Column()
  userId: number;

  @ApiProperty()
  @Column()
  paymentEmail: string;

  @ApiProperty()
  @Column({ nullable: true })
  payoutBatchId: string;

  @ApiProperty()
  @Column({ default: 0 })
  grossAmount: number;

  @ApiProperty()
  @Column({ default: 0 })
  joinARoomFee: number;

  @ApiProperty()
  @Column({ default: 0 })
  payPalFee: number;

  @ApiProperty()
  @Column({ default: 0 })
  netAmount: number;

  @ApiProperty()
  @Column({ default: 0 })
  totalPaid: number;

  @ApiProperty()
  @Column({ default: 0 })
  balance: number;

  @ApiProperty()
  @Column({default: "C"})
  creditOrDebit: string;

  @ApiProperty()
  @Column({ default: 'paypal' })
  preferredProvider: string;

  @OneToOne(type => PaymentDetails, paymentDetail => paymentDetail.payment)
  @JoinColumn()
  paymentDetails: PaymentDetails

}