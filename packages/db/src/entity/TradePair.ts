import {
  type Relation,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { Asset, Order } from '.';

@Entity()
@Index(['baseAsset', 'quoteAsset'], { unique: true })
export class TradePair {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Asset, { nullable: false })
  baseAsset: Relation<Asset>;

  @ManyToOne(() => Asset, { nullable: false })
  quoteAsset: Relation<Asset>;

  @Column({ nullable: true })
  symbol: string;

  @OneToMany(() => Order, (order) => order.tradePair)
  orders: Relation<Order[]>;

  @Column('decimal', { precision: 36, scale: 18 })
  tick_size: string;

  @Column('decimal', { precision: 36, scale: 18 })
  min_order_size: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  generateSymbol() {
    if (this.baseAsset && this.quoteAsset) {
      this.symbol = `${this.baseAsset.name}/${this.quoteAsset.name}`;
    }
  }

  @BeforeInsert()
  @BeforeUpdate()
  validateBeforeSave() {
    if (
      this.baseAsset &&
      this.quoteAsset &&
      this.baseAsset.id === this.quoteAsset.id
    ) {
      throw new Error('Base asset and quote asset cannot be the same');
    }
    this.generateSymbol();
  }
}
