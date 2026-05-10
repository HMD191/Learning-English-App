import 'dotenv/config';
import { DataSource } from 'typeorm';

import { Categories } from './database/entities/category.entity';
import { Words } from './database/entities/word.entity';

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,

  entities: [Categories, Words],
  migrations: ['src/migrations/*.ts'],

  synchronize: false,
});
