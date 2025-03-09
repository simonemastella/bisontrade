import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from './User';

export enum PositionType {
  BUY = 'buy',
  SELL = 'sell',
}
export enum OrderType {
  MARKET = 'market',
  LIMIT = 'limit',
}
export enum StatusType {
  OPEN = 'open',
  CLOSED = 'closed',
  PARTIALLY_FULFILLED = 'partially_fulfilled',
  DELETED = 'deleted',
}

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.orders)
  user: User;

  @Column({
    type: 'enum',
    enum: PositionType,
    default: PositionType.BUY,
  })
  position: PositionType;

  @Column({
    type: 'enum',
    enum: OrderType,
    default: OrderType.MARKET,
  })
  type: OrderType;

  @Column({
    type: 'enum',
    enum: StatusType,
    default: StatusType.OPEN,
  })
  status: StatusType;

  @Column()
  amount: string;

  @Column({ nullable: true })
  price: string;
}
