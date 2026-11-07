import 'dotenv/config';

const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret || jwtSecret.length < 32) {
  throw new Error('JWT_SECRET debe contener al menos 32 caracteres.');
}

export const config = {
  port: Number(process.env.PORT || 3000),
  origin: process.env.APP_ORIGIN || 'http://localhost:5173',
  production: process.env.NODE_ENV === 'production',
  jwtSecret,
  sessionSeconds: 30 * 60,
  database: {
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT || 5455),
    database: process.env.DB_NAME || 'biblioteca',
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  },
};
