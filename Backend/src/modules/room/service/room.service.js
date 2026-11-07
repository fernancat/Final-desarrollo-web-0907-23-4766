import { listRooms } from '../repository/room.repository.js';

export async function getRooms() {
  const rooms = await listRooms();
  return rooms.map((room) => ({ id: room.id, nombre: room.nombre }));
}
