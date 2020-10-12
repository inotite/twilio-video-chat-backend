import { Column, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Audit } from 'src/commons/entity/audit.entity';
import { User } from 'src/user/entity/user.entity';
import { Billing } from 'src/billing/entity/billing.entity';
import { Subscriber } from '../../subscriber/entity/subscriber.entity';
import { Currency } from '../../payment/enum/currency.enum';
import { ApprovePayment } from '../../admin/payments/entity/approve-payment.entity';

@Entity()
export class Event extends Audit {

  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @ApiProperty()
  eventName: string;

  @Column()
  @ApiProperty()
  description: string;

  @Column()
  @ApiProperty()
  maxNoPeople: number;

  @Column({ nullable: true })
  @ApiProperty()
  timezone: string;

  @Column()
  @ApiProperty()
  eventDate: Date;

  @Column()
  @ApiProperty()
  startTime: string;

  @Column()
  @ApiProperty()
  endTime: string;

  @Column({ nullable: true })
  @ApiProperty()
  recurring: boolean;

  @Column({ nullable: true })
  @ApiProperty()
  duration: number;

  @Column({ default: Currency.USD })
  @ApiProperty()
  currency: Currency;

  @Column({ default: 0.00 })
  @ApiProperty()
  price: number;

  @Column({ nullable: true, length: 255 })
  @ApiProperty()
  imageUrl: string;

  @Column({ nullable: true })
  @ApiProperty()
  sharableLink: string;

  @ApiProperty({ type: () => User })
  @ManyToOne(type => User, user => user.events, { eager: true })
  user: User;

  @ApiProperty()
  @OneToMany(type => Subscriber, subscriber => subscriber.event, { eager: true })
  subscribers: Subscriber[];

  @ApiProperty()
  @OneToOne(type => Billing, billing => billing.event, { eager: true })
  billing: Billing;

  @ApiProperty()
  @OneToOne(type => ApprovePayment, approvePayment => approvePayment.event, { cascade: true })
  approvePayment: ApprovePayment;
}