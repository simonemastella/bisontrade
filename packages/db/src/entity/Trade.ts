import {
  type Relation,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  CreateDateColumn,
} from 'typeorm';
import { Order } from '.';

@Entity()
export class Trade {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Order, { nullable: false })
  buyOrder: Relation<Order>;

  @ManyToOne(() => Order, { nullable: false })
  sellOrder: Relation<Order>;

  @Column('decimal', { precision: 36, scale: 18 })
  price: string;

  @Column('decimal', { precision: 78, scale: 0 })
  amount: string;

  @CreateDateColumn()
  timestamp: Date;
}
