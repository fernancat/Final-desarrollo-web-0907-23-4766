import { DataTypes } from 'sequelize';
import { database } from '../../../infrastructure/db/connection.js';

export const Room = database.define('salas', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre: { type: DataTypes.STRING(80), allowNull: false },
});
