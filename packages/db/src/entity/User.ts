import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Holding } from './Holding';
import { Order } from './Order';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @OneToMany(() => Holding, (holding) => holding.user)
  holdings: Holding[];

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];
}
