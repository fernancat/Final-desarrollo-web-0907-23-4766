import express from 'express';
import cookieParser from 'cookie-parser';
import { config } from './config.js';
import { userRouter } from './modules/user/controller/user.controller.js';
import { roomRouter } from './modules/room/controller/room.controller.js';
import { reservationRouter } from './modules/reservation/controller/reservation.controller.js';
import { authenticate } from './modules/user/service/session.js';
import { errorHandler, HttpError } from './shared/errors.js';

export const app = express();
app.disable('x-powered-by');
app.use(express.json({ limit: '16kb' }));
app.use(cookieParser());

app.use('/api', (request, response, next) => {
  response.setHeader('Cache-Control', 'no-store');
  response.setHeader('X-Content-Type-Options', 'nosniff');

  const mutation = !['GET', 'HEAD', 'OPTIONS'].includes(request.method);
  const foreignOrigin = request.headers.origin && request.headers.origin !== config.origin;

  if (mutation && (foreignOrigin || request.headers['sec-fetch-site'] === 'cross-site')) {
    throw new HttpError(403, 'Origen de solicitud no permitido.');
  }

  next();
});

app.use('/api/auth', userRouter);
app.use('/api/rooms', authenticate, roomRouter);
app.use('/api/reservations', authenticate, reservationRouter);
app.use((request, response) => {
  response.status(404).json({ message: 'Ruta no encontrada.' });
});
app.use(errorHandler);
