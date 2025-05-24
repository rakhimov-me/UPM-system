import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Pilot } from './src/entity/Pilot';
// import сюда другие ваши сущности, например:
// import { Zone } from './src/entity/Zone';

export const AppDataSource = new DataSource({
  type:    'postgres',
  host:    process.env.DB_HOST     || 'localhost',
  port:    Number(process.env.DB_PORT) || 5432,
  username:process.env.DB_USER     || 'your_user',
  password:process.env.DB_PASS     || 'your_pass',
  database:process.env.DB_NAME     || 'your_db',
  synchronize: false,             // миграции будут управлять схемой
  logging: false,
  entities: [Pilot /*, Zone, ...*/],
  migrations: ['src/migrations/*.sql'],  // или .ts, если пишете миграции на TypeScript
});