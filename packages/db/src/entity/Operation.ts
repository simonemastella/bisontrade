import {
  type Relation,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
} from 'typeorm';
import { Holding } from '.';

export enum OperationType {
  WITHDRAW = 'withdraw',
  DEPOSIT = 'deposit',
}

@Entity()
export class Operation {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Holding, (holding) => holding.operations)
  holding: Relation<Holding>;

  @Column({
    type: 'enum',
    enum: OperationType,
    default: OperationType.DEPOSIT,
  })
  type: OperationType;

  @Column()
  transaction: string;

  @Column('decimal', { precision: 78, scale: 0 })
  amount: string;

  @Column('decimal', { precision: 78, scale: 0 })
  fee: string;
}
