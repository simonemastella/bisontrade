import {
  type Relation,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';
import { Holding, Order } from '.';
import * as bcrypt from 'bcrypt';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column({ select: false })
  password: string;
  setPassword(password: string) {
    this.password = bcrypt.hashSync(password, 10);
  }
  checkPassword(password: string): boolean {
    return bcrypt.compareSync(password, this.password);
  }

  @OneToMany(() => Holding, (holding) => holding.user)
  holdings: Relation<Holding[]>;

  @OneToMany(() => Order, (order) => order.user)
  orders: Relation<Order[]>;
}
