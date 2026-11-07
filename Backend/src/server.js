import { app } from './app.js';
import { config } from './config.js';
import { database } from './infrastructure/db/connection.js';

await database.authenticate();

const server = app.listen(config.port, () => {
  console.log(`API disponible en http://localhost:${config.port}`);
});

async function shutdown() {
  server.close(async () => {
    await database.close();
    process.exit(0);
  });
}

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
