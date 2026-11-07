import * as repository from '../repository/reservation.repository.js';
import { findRoom } from '../../room/repository/room.repository.js';
import { dateDto, idDto, reservationDto, reservationOutput } from '../reservation.dto.js';
import { HttpError } from '../../../shared/errors.js';

export async function reserve(input, userId) {
  const data = reservationDto.parse(input);
  const room = await findRoom(data.sala_id);

  if (!room) {
    throw new HttpError(404, 'La sala no existe.');
  }

  const reservation = await repository.createReservation({ ...data, usuario_id: userId });
  return reservationOutput(reservation);
}

export async function myReservations(userId) {
  const rows = await repository.listForUser(userId);
  return rows.map(reservationOutput);
}

export async function roomSchedule(roomId, date) {
  const id = idDto.parse(roomId);
  const fecha = dateDto.parse(date);
  const rows = await repository.listForRoom(id, fecha);
  return rows.map(reservationOutput);
}

export async function cancel(reservationId, userId) {
  const id = idDto.parse(reservationId);
  const deleted = await repository.deleteForUser(id, userId);

  if (!deleted) {
    throw new HttpError(404, 'No se encontró tu reserva.');
  }
}
