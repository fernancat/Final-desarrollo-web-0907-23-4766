import { request } from './client.js';

export async function getMyReservations() {
  return await request('/reservations');
}

export async function getRoomSchedule(roomId, date) {
  const query = new URLSearchParams({ fecha: date });

  return await request(`/reservations/schedule/${roomId}?${query}`);
}

export async function createReservation(data) {
  return await request('/reservations', { method: 'POST', body: data });
}

export async function cancelReservation(id) {
  await request(`/reservations/${id}`, { method: 'DELETE' });
}
