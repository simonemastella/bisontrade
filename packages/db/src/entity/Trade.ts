import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  Column,
  CreateDateColumn,
} from 'typeorm';
import { Asset } from './Asset';
import { Order } from './Order';

@Entity()
export class Trade {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Order, { nullable: false })
  buyOrder: Order;

  @ManyToOne(() => Order, { nullable: false })
  sellOrder: Order;

  @Column('float')
  price: number;

  @Column('decimal', { precision: 78, scale: 0 })
  amount: number;

  @CreateDateColumn()
  timestamp: Date;
}
