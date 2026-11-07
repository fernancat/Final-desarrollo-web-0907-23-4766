import { z } from 'zod';

const email = z.string().trim().toLowerCase().email('Ingresa un correo válido.').max(254);
const password = z.string().min(8, 'La contraseña debe tener al menos 8 caracteres.')
  .refine((value) => Buffer.byteLength(value, 'utf8') <= 72, 'La contraseña no puede superar 72 bytes.');

export const registerDto = z.object({
  nombre: z.string().trim().min(1, 'Ingresa tu nombre.').max(80),
  apellidos: z.string().trim().min(1, 'Ingresa tus apellidos.').max(120),
  correo: email,
  contrasena: password,
}).strict();

export const loginDto = z.object({ correo: email, contrasena: password }).strict();

export function publicUser(user) {
  return { id: user.id, nombre: user.nombre, apellidos: user.apellidos, correo: user.correo };
}
