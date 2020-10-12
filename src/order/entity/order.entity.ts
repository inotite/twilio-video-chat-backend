import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { PurchaseUnits } from './purchase-unit.entity';
import { Audit } from '../../commons/entity/audit.entity';

@Entity()
export class Order extends Audit {

  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  eventId: number;

  @ApiProperty()
  @Column()
  userId: number;

  @ApiProperty()
  @Column({ default: 'paypal' })
  provider: string;

  @ApiProperty()
  @Column({ default: null })
  paypalOrderId: string;

  @ApiProperty()
  @Column({ default: null })
  approvalUrl: string;

  @Column({ default: null })
  surname: string;

  @Column({ default: null })
  name: string;

  @Column({ default: null })
  email: string;

  @Column({ default: null })
  status: string;

  @Column({ default: null })
  payerId: string;

  @Column({ default: null })
  referenceId: string;

  @OneToMany(type => PurchaseUnits, purchaseUnits => purchaseUnits.order, { cascade: true, eager: true })
  purchaseUnits: PurchaseUnits[];
}