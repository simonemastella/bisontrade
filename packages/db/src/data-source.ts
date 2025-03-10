import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from './entity/User';
import { Asset } from './entity/Asset';
import { Holding } from './entity/Holding';
import { Operation } from './entity/Operation';
import { Order } from './entity/Order';
import { Trade } from './entity/Trade';
import { TradePair } from './entity/TradePair';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_URL || 'localhost',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'development',
  synchronize: false,
  logging: false,
  entities: [Asset, Holding, Operation, Order, Trade, TradePair, User],
  migrations: [],
  subscribers: [],
});
