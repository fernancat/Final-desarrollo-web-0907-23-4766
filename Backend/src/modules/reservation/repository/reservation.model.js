import { DataTypes } from 'sequelize';
import { database } from '../../../infrastructure/db/connection.js';
import { Room } from '../../room/repository/room.model.js';

export const Reservation = database.define('reservaciones', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  usuario_id: { type: DataTypes.INTEGER, allowNull: false },
  sala_id: { type: DataTypes.INTEGER, allowNull: false },
  fecha: { type: DataTypes.DATEONLY, allowNull: false },
  hora_inicio: { type: DataTypes.TIME, allowNull: false },
  hora_fin: { type: DataTypes.TIME, allowNull: false },
});

Reservation.belongsTo(Room, { foreignKey: 'sala_id', as: 'sala' });
