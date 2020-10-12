import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Audit } from '../../commons/entity/audit.entity';
import { Order } from './order.entity';

@Entity()
export class PurchaseUnits extends Audit{

  @PrimaryGeneratedColumn()
  id: number;

  @Column({nullable: true})
  addressLine1: string;

  @Column({nullable: true})
  addressLine2: string;

  @Column({nullable: true})
  adminArea1: string;

  @Column({nullable: true})
  adminArea2: string;

  @Column({nullable: true})
  postalCode: string;

  @Column({nullable: true})
  countryCode: string;

  @Column({nullable: false})
  captureId: string;

  @Column({nullable: true})
  status: string;

  @Column({nullable: true})
  amount: number;

  @Column({nullable: true})
  grossAmount: number;

  @Column({nullable: true})
  payPalFee: number;

  @Column({nullable: true})
  netAmount: number;

  @Column({nullable: true})
  currencyCode: string;

  @ManyToOne(type => Order, order => order.purchaseUnits)
  order: Order;

}