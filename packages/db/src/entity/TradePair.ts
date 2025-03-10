import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Asset } from './Asset';
import { Order } from './Order';

@Entity()
@Index(['baseAsset', 'quoteAsset'], { unique: true })
export class TradePair {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Asset, { nullable: false })
  baseAsset: Asset;

  @ManyToOne(() => Asset, { nullable: false })
  quoteAsset: Asset;

  @OneToMany(() => Order, (order) => order.tradePair)
  orders: Order[];

  @Column('decimal', { precision: 18, scale: 8 })
  minimum: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
