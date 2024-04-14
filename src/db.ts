import dotenv from 'dotenv';
import knex from 'knex';

dotenv.config();

const connection = knex({
  client: 'pg',
  connection: {
    host: 'localhost',
    port: 5432,
    database: 'plaza_db',
    user: 'plaza',
    password: 'password',
  },
});

export default connection;
