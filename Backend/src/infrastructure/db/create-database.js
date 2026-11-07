import pg from 'pg';
import { config } from '../../config.js';

const client = new pg.Client({
  host: config.database.host,
  port: config.database.port,
  user: config.database.username,
  password: config.database.password,
  database: 'postgres',
});

try {
  await client.connect();

  const name = config.database.database;
  const result = await client.query('SELECT 1 FROM pg_database WHERE datname = $1', [name]);

  if (result.rowCount === 0) {
    const identifier = '"' + name.replaceAll('"', '""') + '"';
    await client.query(`CREATE DATABASE ${identifier}`);
  }

  console.log(`Base de datos ${name} lista.`);
} finally {
  await client.end();
}
