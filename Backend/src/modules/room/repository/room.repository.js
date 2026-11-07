import { Room } from './room.model.js';

export async function listRooms() {
  return await Room.findAll({ order: [['id', 'ASC']] });
}

export async function findRoom(id) {
  return await Room.findByPk(id);
}
