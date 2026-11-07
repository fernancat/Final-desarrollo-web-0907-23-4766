export async function create(database, transaction) {
  await database.query('CREATE EXTENSION IF NOT EXISTS btree_gist', { transaction });

  await database.query(`
    CREATE TABLE reservaciones (
      id SERIAL PRIMARY KEY,
      usuario_id INTEGER NOT NULL REFERENCES usuarios(id),
      sala_id INTEGER NOT NULL REFERENCES salas(id),
      fecha DATE NOT NULL,
      hora_inicio TIME NOT NULL,
      hora_fin TIME NOT NULL,
      CONSTRAINT horario_valido CHECK (hora_inicio < hora_fin),
      CONSTRAINT reserva_sin_solapamiento EXCLUDE USING gist (
        sala_id WITH =,
        tsrange(fecha + hora_inicio, fecha + hora_fin, '[)') WITH &&
      )
    )
  `, { transaction });

  await database.query('CREATE INDEX reservaciones_usuario_idx ON reservaciones(usuario_id)', { transaction });
}

export async function drop(database, transaction) {
  await database.query('DROP TABLE reservaciones', { transaction });
}
