import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Holding } from './Holding';

@Entity()
export class Asset {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => Holding, (holding) => holding.asset)
  holdings: Holding[];

  @Column()
  address: string;

  @Column()
  name: string;

  @Column()
  name2: string;

  @Column()
  decimals: number;

  @Column()
  network: string;

  @Column()
  icon: string;

  @Column('float')
  fee: number;
}
