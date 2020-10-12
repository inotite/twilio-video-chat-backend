import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Currency } from '../enum/currency.enum';
import { User } from '../../user/entity/user.entity';
import { Payment } from './payment.entity';

@Entity()
export class PaymentDetails {

  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  paymentEmail: string;

  @ApiProperty()
  @Column({ default: Currency.USD})
  currency: Currency;

  @ApiProperty()
  @Column({ default: null })
  countryCode: string;

  @ApiProperty()
  @Column({ default: null })
  mobileNumber: string;

  @OneToOne(type => User, user => user.paymentDetails, {eager: true})
  @JoinColumn()
  user: User;

  @OneToOne(type => Payment, payment => payment.paymentDetails)
  payment: Payment
}