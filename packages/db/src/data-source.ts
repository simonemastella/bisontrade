import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as entity from './entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: env.POSTGRES_HOST,
  port: env.POSTGRES_PORT,
  username: env.POSTGRES_USER,
  password: env.POSTGRES_PASSWORD,
  database: env.POSTGRES_DB,
  synchronize: false,
  logging: false,
  entities: [
    entity.Asset,
    entity.Holding,
    entity.Operation,
    entity.Order,
    entity.Trade,
    entity.TradePair,
    entity.User,
  ],
  migrations: [],
  subscribers: [],
});
