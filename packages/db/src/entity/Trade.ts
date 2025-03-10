import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  CreateDateColumn,
} from 'typeorm';
import { Order } from './Order';

@Entity()
export class Trade {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Order, { nullable: false })
  buyOrder: Order;

  @ManyToOne(() => Order, { nullable: false })
  sellOrder: Order;

  @Column('decimal', { precision: 36, scale: 18 })
  price: string;

  @Column('decimal', { precision: 78, scale: 0 })
  amount: string;

  @CreateDateColumn()
  timestamp: Date;
}
