import { DataTypes } from 'sequelize';
import { database } from '../../../infrastructure/db/connection.js';

export const User = database.define('usuarios', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre: { type: DataTypes.STRING(80), allowNull: false },
  apellidos: { type: DataTypes.STRING(120), allowNull: false },
  correo: { type: DataTypes.STRING(254), allowNull: false, unique: true },
  contrasena_hash: { type: DataTypes.STRING(60), allowNull: false },
});
