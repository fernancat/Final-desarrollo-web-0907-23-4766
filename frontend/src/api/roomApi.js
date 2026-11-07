import { request } from './client.js';

export async function getRooms() {
  return await request('/rooms');
}
