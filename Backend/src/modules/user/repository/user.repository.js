import { User } from './user.model.js';

export async function findByEmail(correo) {
  return await User.findOne({ where: { correo } });
}

export async function findById(id) {
  return await User.findByPk(id, { attributes: ['id', 'nombre', 'apellidos', 'correo'] });
}

export async function createUser(data) {
  return await User.create(data);
}
