import test from 'node:test';
import assert from 'node:assert/strict';
import { once } from 'node:events';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { app } from '../src/app.js';
import { config } from '../src/config.js';
import { database } from '../src/infrastructure/db/connection.js';
import { User } from '../src/modules/user/repository/user.model.js';
import { Reservation } from '../src/modules/reservation/repository/reservation.model.js';

 test('autenticación, validación, propiedad y concurrencia de reservas', async () => {
  const server = app.listen(0, '127.0.0.1');
  await once(server, 'listening');
  const base = `http://127.0.0.1:${server.address().port}/api`;
  const users = [];

  async function request(path, method = 'GET', body, cookie) {
    const response = await fetch(base + path, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(cookie ? { Cookie: cookie } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    return response;
  }

  try {
    assert.equal((await request('/rooms')).status, 401);
    const input = {
      nombre: 'Prueba',
      apellidos: 'Integración',
      correo: `test-${Date.now()}@example.com`,
      contrasena: 'UnaClave123!',
    };
    const registration = await request('/auth/register', 'POST', input);
    assert.equal(registration.status, 201);
    const user = await registration.json();
    users.push(user.id);
    assert.equal(user.contrasena_hash, undefined);
    const cookieHeader = registration.headers.get('set-cookie');
    assert.match(cookieHeader, /HttpOnly/);
    assert.match(cookieHeader, /SameSite=Strict/);
    const cookie = cookieHeader.split(';')[0];
    const saved = await User.findByPk(user.id);
    assert.equal(bcrypt.getRounds(saved.contrasena_hash), 10);
    assert.equal((await request('/auth/register', 'POST', input)).status, 409);
    assert.equal((await request('/auth/login', 'POST', { correo: input.correo, contrasena: 'incorrecta' })).status, 401);
    assert.equal((await request('/auth/login', 'POST', { correo: input.correo, contrasena: input.contrasena })).status, 200);
    assert.equal((await request('/auth/me', 'GET', undefined, cookie)).status, 200);

    const expired = jwt.sign({}, config.jwtSecret, {
      subject: String(user.id), expiresIn: -1, issuer: 'biblioteca', audience: 'biblioteca-web',
    });
    assert.equal((await request('/auth/me', 'GET', undefined, `sesion=${expired}`)).status, 401);

    const rooms = await (await request('/rooms', 'GET', undefined, cookie)).json();
    const data = { sala_id: rooms[0].id, fecha: '2099-10-15', hora_inicio: '10:00', hora_fin: '11:00' };
    assert.equal((await request('/reservations', 'POST', { ...data, hora_fin: '09:00' }, cookie)).status, 400);
    assert.equal((await request('/reservations', 'POST', { ...data, fecha: '2020-01-01' }, cookie)).status, 400);
    assert.equal((await request('/reservations', 'POST', { ...data, fecha: '2099-02-30' }, cookie)).status, 400);
    assert.equal((await request('/reservations', 'POST', { ...data, usuario_id: 999 }, cookie)).status, 400);

    const simultaneous = await Promise.all([
      request('/reservations', 'POST', data, cookie),
      request('/reservations', 'POST', data, cookie),
    ]);
    assert.deepEqual(simultaneous.map((response) => response.status).sort(), [201, 409]);
    assert.equal((await request('/reservations', 'POST', { ...data, hora_inicio: '10:30', hora_fin: '11:30' }, cookie)).status, 409);
    assert.equal((await request('/reservations', 'POST', { ...data, hora_inicio: '11:00', hora_fin: '12:00' }, cookie)).status, 201);
    assert.equal((await request('/reservations', 'POST', { ...data, sala_id: rooms[1].id }, cookie)).status, 201);

    const mine = await (await request('/reservations', 'GET', undefined, cookie)).json();
    assert.equal(mine.length, 3);
    const other = await request('/auth/register', 'POST', { ...input, correo: `other-${Date.now()}@example.com` });
    users.push((await other.json()).id);
    const otherCookie = other.headers.get('set-cookie').split(';')[0];
    assert.equal((await request(`/reservations/${mine[0].id}`, 'DELETE', undefined, otherCookie)).status, 404);
    const schedule = await (await request(`/reservations/schedule/${rooms[0].id}?fecha=${data.fecha}`, 'GET', undefined, otherCookie)).json();
    assert.equal(schedule.length, 2);
    assert.equal(schedule[0].usuario_id, undefined);
    assert.equal((await request(`/reservations/${mine[0].id}`, 'DELETE', undefined, cookie)).status, 204);
    assert.equal((await request('/auth/logout', 'POST', undefined, cookie)).status, 204);

    const blocked = await fetch(base + '/auth/login', {
      method: 'POST',
      headers: { Origin: 'https://foreign.example', 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });
    assert.equal(blocked.status, 403);
  } finally {
    await Reservation.destroy({ where: { usuario_id: users } });
    await User.destroy({ where: { id: users } });
    server.close();
    await once(server, 'close');
    await database.close();
  }
});
