import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from './User';
import { Operation } from './Operation';
import { Asset } from './Asset';

@Entity()
export class Holding {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.holdings)
  user: User;

  @OneToMany(() => Operation, (operation) => operation.holding)
  operations: Operation[];

  @ManyToOne(() => Asset, (asset) => asset.holdings)
  asset: Asset;

  @Column('decimal', { precision: 78, scale: 0 })
  amount: string;
}
