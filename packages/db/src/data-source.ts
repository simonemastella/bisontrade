import env from './env';
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as entity from './entity';
import { Init1742240909861 } from './migrations/1742240909861-Init';
export * from './entity';

const entities = [
  entity.Asset,
  entity.Holding,
  entity.Operation,
  entity.Order,
  entity.Trade,
  entity.TradePair,
  entity.User,
];

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: env.POSTGRES_HOST,
  port: env.POSTGRES_PORT,
  username: env.POSTGRES_USER,
  password: env.POSTGRES_PASSWORD,
  database: env.POSTGRES_DB,
  synchronize: false,
  logging: false,
  entities,
  migrations: [Init1742240909861],
  migrationsRun: true,
  subscribers: [],
});
