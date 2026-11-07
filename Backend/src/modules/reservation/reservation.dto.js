import { z } from 'zod';

export const idDto = z.coerce.number().int().positive();
export const dateDto = z.iso.date('Ingresa una fecha válida.');
const time = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Ingresa una hora válida.');

export const reservationDto = z.object({
  sala_id: z.number().int().positive(),
  fecha: dateDto,
  hora_inicio: time,
  hora_fin: time,
}).strict().refine((data) => data.hora_inicio < data.hora_fin, {
  message: 'La hora final debe ser posterior a la hora inicial.',
  path: ['hora_fin'],
}).refine((data) => {
  const start = new Date(`${data.fecha}T${data.hora_inicio}:00-06:00`);
  return start.getTime() > Date.now();
}, { message: 'Selecciona un horario futuro (hora de Guatemala).', path: ['fecha'] });

export function reservationOutput(row) {
  return {
    id: row.id,
    sala_id: row.sala_id,
    fecha: row.fecha,
    hora_inicio: row.hora_inicio.slice(0, 5),
    hora_fin: row.hora_fin.slice(0, 5),
    sala: row.sala ? { id: row.sala.id, nombre: row.sala.nombre } : undefined,
  };
}
