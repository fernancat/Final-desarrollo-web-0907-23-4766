import { Reservation } from './reservation.model.js';
import { Room } from '../../room/repository/room.model.js';

export async function createReservation(data) {
  return await Reservation.create(data);
}

export async function listForUser(usuario_id) {
  return await Reservation.findAll({
    where: { usuario_id },
    include: [{ model: Room, as: 'sala' }],
    order: [['fecha', 'ASC'], ['hora_inicio', 'ASC']],
  });
}

export async function listForRoom(sala_id, fecha) {
  return await Reservation.findAll({
    where: { sala_id, fecha },
    attributes: ['id', 'sala_id', 'fecha', 'hora_inicio', 'hora_fin'],
    order: [['hora_inicio', 'ASC']],
  });
}

export async function deleteForUser(id, usuario_id) {
  return await Reservation.destroy({ where: { id, usuario_id } });
}
