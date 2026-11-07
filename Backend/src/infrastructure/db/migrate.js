import { database } from './connection.js';
import * as users from './migrations/001_user_migration.js';
import * as rooms from './migrations/002_room_migration.js';
import * as reservations from './migrations/003_reservation_migration.js';

const migrations = [
  ['001_user_migration', users],
  ['002_room_migration', rooms],
  ['003_reservation_migration', reservations],
];

try {
  await database.transaction(async (transaction) => {
    await database.query('SELECT pg_advisory_xact_lock(54553000)', { transaction });
    await database.query('CREATE TABLE IF NOT EXISTS migraciones (nombre TEXT PRIMARY KEY)', { transaction });

    const [rows] = await database.query('SELECT nombre FROM migraciones ORDER BY nombre', { transaction });
    const applied = new Set(rows.map((row) => row.nombre));
    const rollback = process.argv[2] === 'down';
    const pending = rollback ? [...migrations].reverse() : migrations;

    for (const [name, migration] of pending) {
      if (rollback && applied.has(name)) {
        await migration.drop(database, transaction);
        await database.query('DELETE FROM migraciones WHERE nombre = :name', { replacements: { name }, transaction });
        console.log(`Revertida: ${name}`);
        break;
      }

      if (!rollback && !applied.has(name)) {
        await migration.create(database, transaction);
        await database.query('INSERT INTO migraciones VALUES (:name)', { replacements: { name }, transaction });
        console.log(`Aplicada: ${name}`);
      }
    }
  });
} finally {
  await database.close();
}
