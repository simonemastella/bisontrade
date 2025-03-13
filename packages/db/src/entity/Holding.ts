import {
  type Relation,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';

import { User, Operation, Asset } from '.';

@Entity()
export class Holding {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.holdings)
  user: Relation<User>;

  @OneToMany(() => Operation, (operation) => operation.holding)
  operations: Relation<Operation[]>;

  @ManyToOne(() => Asset, (asset) => asset.holdings)
  asset: Relation<Asset>;

  @Column('decimal', { precision: 78, scale: 0 })
  amount: string;
}
