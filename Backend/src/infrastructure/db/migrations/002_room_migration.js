export async function create(database, transaction) {
  await database.query(`
    CREATE TABLE salas (
      id SERIAL PRIMARY KEY,
      nombre VARCHAR(80) NOT NULL UNIQUE
    )
  `, { transaction });

  await database.query(`
    INSERT INTO salas (nombre)
    VALUES ('Sala de lectura'), ('Sala de estudio'), ('Sala de investigación'), ('Sala de trabajo en grupo')
  `, { transaction });
}

export async function drop(database, transaction) {
  await database.query('DROP TABLE salas', { transaction });
}
