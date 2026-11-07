import bcrypt from 'bcrypt';
import * as repository from '../repository/user.repository.js';
import { loginDto, registerDto, publicUser } from '../user.dto.js';
import { HttpError } from '../../../shared/errors.js';

const dummyHash = await bcrypt.hash('invalid-login-placeholder', 10);

export async function register(input) {
  const data = registerDto.parse(input);
  const contrasena_hash = await bcrypt.hash(data.contrasena, 10);
  const user = await repository.createUser({
    nombre: data.nombre,
    apellidos: data.apellidos,
    correo: data.correo,
    contrasena_hash,
  });

  return publicUser(user);
}

export async function login(input) {
  const data = loginDto.parse(input);
  const user = await repository.findByEmail(data.correo);
  const valid = await bcrypt.compare(data.contrasena, user?.contrasena_hash || dummyHash);

  if (!user || !valid) {
    throw new HttpError(401, 'Correo o contraseña incorrectos.');
  }

  return publicUser(user);
}
