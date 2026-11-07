export async function create(database, transaction) {
  await database.query(`
    CREATE TABLE usuarios (
      id SERIAL PRIMARY KEY,
      nombre VARCHAR(80) NOT NULL,
      apellidos VARCHAR(120) NOT NULL,
      correo VARCHAR(254) NOT NULL UNIQUE,
      contrasena_hash VARCHAR(60) NOT NULL
    )
  `, { transaction });
}

export async function drop(database, transaction) {
  await database.query('DROP TABLE usuarios', { transaction });
}
