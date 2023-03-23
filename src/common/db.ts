// import { Pool } from 'pg'
import { DataSource } from 'typeorm';
import { Product } from '../products/models/Product';

let appDataSource!: DataSource;

export const initializeConnection = async (): Promise<DataSource> => {
  appDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: process.env.POSTGRES_DB_USER,
    password: process.env.POSTGRES_DB_PASSWORD,
    database: process.env.POSTGRES_DB_NAME,
    synchronize: true,
    logging: false,
    entities: [Product],
    subscribers: [],
    migrations: [],
  });

  await appDataSource.initialize();
  return appDataSource;
}

export const closeDBConnection = async (): Promise<void> => {
  if (appDataSource.isInitialized) {
    await appDataSource.destroy();
  }
}