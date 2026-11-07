import { Router } from 'express';
import * as service from '../service/reservation.service.js';

export const reservationRouter = Router();

reservationRouter.get('/', async (request, response) => {
  response.json(await service.myReservations(request.user.id));
});

reservationRouter.get('/schedule/:roomId', async (request, response) => {
  response.json(await service.roomSchedule(request.params.roomId, request.query.fecha));
});

reservationRouter.post('/', async (request, response) => {
  const reservation = await service.reserve(request.body, request.user.id);
  response.status(201).json(reservation);
});

reservationRouter.delete('/:id', async (request, response) => {
  await service.cancel(request.params.id, request.user.id);
  response.status(204).end();
});
