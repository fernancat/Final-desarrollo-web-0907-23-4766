import { isPast, overlaps } from '../utils/time.js';

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;

function validateSchedule(data, occupied) {
  if (data.hora_inicio >= data.hora_fin) {
    return { hora_fin: 'La hora final debe ser posterior a la hora inicial.' };
  }

  if (isPast(data.fecha, data.hora_inicio)) {
    return { fecha: 'Selecciona un horario futuro (hora de Guatemala).' };
  }

  const collision = occupied.some((reservation) => overlaps(reservation, data));

  if (collision) {
    return { hora_inicio: 'La sala ya está reservada en ese horario.' };
  }

  return {};
}

export function reservationDto(draft, occupied = []) {
  const data = {
    sala_id: Number(draft.sala_id),
    fecha: draft.fecha,
    hora_inicio: draft.hora_inicio,
    hora_fin: draft.hora_fin,
  };

  const errors = {};

  if (!data.sala_id) {
    errors.sala_id = 'Selecciona una sala.';
  }

  if (!DATE_PATTERN.test(data.fecha)) {
    errors.fecha = 'Ingresa una fecha válida.';
  }

  if (!TIME_PATTERN.test(data.hora_inicio)) {
    errors.hora_inicio = 'Ingresa una hora válida.';
  }

  if (!TIME_PATTERN.test(data.hora_fin)) {
    errors.hora_fin = 'Ingresa una hora válida.';
  }

  const hasErrors = Object.keys(errors).length > 0;

  if (hasErrors) {
    return { data, errors };
  }

  return { data, errors: validateSchedule(data, occupied) };
}
