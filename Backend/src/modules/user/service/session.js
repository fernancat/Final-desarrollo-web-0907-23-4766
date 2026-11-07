import jwt from 'jsonwebtoken';
import { config } from '../../../config.js';
import { findById } from '../repository/user.repository.js';
import { HttpError } from '../../../shared/errors.js';

const cookieOptions = {
  httpOnly: true,
  secure: config.production,
  sameSite: 'strict',
  path: '/api',
};

export function issueSession(response, user) {
  const token = jwt.sign({}, config.jwtSecret, {
    subject: String(user.id),
    expiresIn: config.sessionSeconds,
    algorithm: 'HS256',
    issuer: 'biblioteca',
    audience: 'biblioteca-web',
  });

  response.cookie('sesion', token, { ...cookieOptions, maxAge: config.sessionSeconds * 1000 });
  response.setHeader('X-Session-Expires-At', String(Date.now() + config.sessionSeconds * 1000));
}

export function clearSession(response) {
  response.clearCookie('sesion', cookieOptions);
}

export async function authenticate(request, response, next) {
  let payload;

  try {
    payload = jwt.verify(request.cookies.sesion || '', config.jwtSecret, {
      algorithms: ['HS256'],
      issuer: 'biblioteca',
      audience: 'biblioteca-web',
    });
  } catch {
    clearSession(response);
    throw new HttpError(401, 'Tu sesión expiró. Inicia sesión nuevamente.');
  }

  const user = await findById(payload.sub);

  if (!user) {
    clearSession(response);
    throw new HttpError(401, 'Inicia sesión nuevamente.');
  }

  request.user = user;
  issueSession(response, user);
  next();
}
