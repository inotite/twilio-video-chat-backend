import { BeforeInsert, Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { ApiProperty } from '@nestjs/swagger';
import { Audit } from 'src/commons/entity/audit.entity';
import { Event } from 'src/event/entity/events.entity';
import { PaymentDetails } from '../../payment/entity/payment-details.entity';

@Entity()
export class User extends Audit {

  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, select: false })
  password: string;

  @ApiProperty()
  @Column({ unique: true })
  username: string;

  @Column({ nullable: true })
  mobileNumber: string;

  @ApiProperty()
  @Column({ unique: true })
  email: string;

  @ApiProperty()
  @Column({ default: 'USER' })
  role: string;

  @OneToMany(type => Event, event => event.user, { cascade: true, lazy: true })
  events: Event[];

  @OneToOne(type => PaymentDetails, paymentDetails => paymentDetails.user)
  paymentDetails: PaymentDetails;

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }
}