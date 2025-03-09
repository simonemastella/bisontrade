import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  Column,
} from 'typeorm';
import { Asset } from './Asset';

@Entity()
export class TradePair {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Asset, { nullable: false })
  baseAsset: Asset;

  @ManyToOne(() => Asset, { nullable: false })
  quoteAsset: Asset;

  @Column('float')
  minimum: number;
}
