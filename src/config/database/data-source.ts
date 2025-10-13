import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotnev from 'dotenv';

dotnev.config();

const env = process.env;

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  database: env.DB_NAME!,
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/config/database/migrations/*.js'],
  username: env.DB_USER!,
  host: env.DB_HOST!,
  port: Number(env.DB_PORT!) ?? 5432,
  password: env.DB_PASSWORD!,
  synchronize: true,
  logger: 'formatted-console',
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
