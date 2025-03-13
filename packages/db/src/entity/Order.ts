import {
  type Relation,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User, Trade, TradePair } from '.';

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
  user: Relation<User>;

  @ManyToOne(() => TradePair, (tradePair) => tradePair.orders)
  tradePair: Relation<TradePair>;

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

  @Column('decimal', { precision: 78, scale: 0 })
  amount: string;

  @Column('decimal', { precision: 36, scale: 18, nullable: true })
  price: string;

  @OneToMany(() => Trade, (trade) => trade.buyOrder)
  buyTrades: Relation<Trade[]>;

  @OneToMany(() => Trade, (trade) => trade.sellOrder)
  sellTrades: Relation<Trade[]>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
