import { request } from './client.js';

export async function register(data) {
  return await request('/auth/register', { method: 'POST', body: data, publicRoute: true });
}

export async function login(data) {
  return await request('/auth/login', { method: 'POST', body: data, publicRoute: true });
}

export async function getCurrentUser({ silent = false } = {}) {
  return await request('/auth/me', { publicRoute: silent });
}

export async function logout() {
  await request('/auth/logout', { method: 'POST', publicRoute: true });
}
