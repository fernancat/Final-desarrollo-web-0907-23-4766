import { Router } from 'express';
import { getRooms } from '../service/room.service.js';

export const roomRouter = Router();

roomRouter.get('/', async (request, response) => {
  response.json(await getRooms());
});
