import { Router } from 'express';
import { rateLimit } from 'express-rate-limit';
import * as service from '../service/user.service.js';
import { authenticate, issueSession, clearSession } from '../service/session.js';
import { publicUser } from '../user.dto.js';

export const userRouter = Router();
const limit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { message: 'Demasiados intentos. Intenta nuevamente en 15 minutos.' },
});

userRouter.post('/register', limit, async (request, response) => {
  const user = await service.register(request.body);
  issueSession(response, user);
  response.status(201).json(user);
});

userRouter.post('/login', limit, async (request, response) => {
  const user = await service.login(request.body);
  issueSession(response, user);
  response.json(user);
});

userRouter.get('/me', authenticate, async (request, response) => {
  response.json(publicUser(request.user));
});

userRouter.post('/logout', async (request, response) => {
  clearSession(response);
  response.status(204).end();
});
