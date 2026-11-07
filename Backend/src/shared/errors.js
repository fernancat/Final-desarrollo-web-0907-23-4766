export class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

export function errorHandler(error, request, response, next) {
  if (response.headersSent) {
    return next(error);
  }

  if (error.name === 'ZodError') {
    return response.status(400).json({
      message: error.issues[0].message,
      errors: error.issues.map((issue) => ({ field: issue.path.join('.'), message: issue.message })),
    });
  }

  if (error.original?.code === '23P01') {
    return response.status(409).json({ message: 'La sala ya está reservada en ese horario.' });
  }

  if (error.name === 'SequelizeUniqueConstraintError') {
    return response.status(409).json({ message: 'El correo ya está registrado.' });
  }

  const status = error.status || 500;

  if (status >= 500) {
    console.error(error);
  }

  const message = status >= 500 ? 'No fue posible completar la solicitud.' : error.message;
  return response.status(status).json({ message });
}
