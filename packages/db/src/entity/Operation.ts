import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';

import { Holding } from './Holding';

export enum OperationType {
  WITHDRAW = 'withdraw',
  DEPOSIT = 'deposit',
}

@Entity()
export class Operation {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Holding, (holding) => holding.operations)
  holding: Holding;

  @Column({
    type: 'enum',
    enum: OperationType,
    default: OperationType.DEPOSIT,
  })
  type: OperationType;

  @Column()
  transaction: string;

  @Column()
  amount: string;

  @Column()
  fee: string;
}
