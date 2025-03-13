import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as entity from './entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_URL || 'localhost',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'development',
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
