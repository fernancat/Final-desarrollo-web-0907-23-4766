# API de reservas

Node.js y Express, Sequelize y PostgreSQL. Todo el código fuente es JavaScript.

## Inicio

Desde `Backend`:

```sh
pnpm install
cp .env.example .env
# Reemplazar JWT_SECRET por un secreto aleatorio de al menos 32 caracteres.
pnpm db:create
pnpm db:migrate
pnpm dev
```

El archivo `.env` local ya está configurado y no se versiona. La API escucha en 3000; el frontend usa un proxy para compartir origen. En producción se debe publicar `/api` bajo el mismo origen, configurar `APP_ORIGIN`, usar HTTPS y `NODE_ENV=production`.

## Modelo

- `usuarios`: id, nombre, apellidos, correo único, contrasena_hash.
- `salas`: id, nombre. Se crean cuatro salas iniciales.
- `reservaciones`: id, usuario_id, sala_id, fecha, hora_inicio, hora_fin.

Reservaciones relaciona usuarios con salas y almacena el horario de cada uso. Fechas y horas pertenecen a la reserva, no a la sala. Horarios expresados en hora de Guatemala (UTC−06:00), sin cruces de medianoche. La exclusión GiST en PostgreSQL impide solapamientos incluso con solicitudes concurrentes; utiliza intervalos `[inicio, fin)` para permitir reservas contiguas. El usuario de base de datos debe poder instalar `btree_gist`.

Las migraciones numeradas exportan `create` y `drop`. `pnpm db:migrate` aplica las pendientes en una transacción; `pnpm db:rollback` revierte solo la última (borra sus datos). La tabla técnica `migraciones` registra el esquema; no contiene sesiones. No se utiliza `sync()`.

## Sesión y validación

Bcrypt con coste 10. JWT HS256 de 30 minutos, en cookie HttpOnly/SameSite=Strict, Secure en producción. Cada petición autenticada renueva su vencimiento: se interpreta el requisito como **30 minutos de inactividad**. Un token vencido devuelve 401. Logout elimina la cookie; por ser JWT sin estado no se mantiene una lista de revocación de tokens. Los DTO validan entradas y las respuestas nunca exponen hashes. La API verifica el origen de las mutaciones y limita intentos de registro/login.

## Rutas

| Método | Ruta | Uso |
| --- | --- | --- |
| POST | /api/auth/register | nombre, apellidos, correo, contrasena |
| POST | /api/auth/login | correo, contrasena |
| GET | /api/auth/me | Usuario autenticado y renovación |
| POST | /api/auth/logout | Cerrar sesión |
| GET | /api/rooms | Listar salas |
| GET | /api/reservations | Mis reservas |
| GET | /api/reservations/schedule/:roomId?fecha=YYYY-MM-DD | Horarios ocupados sin datos de usuarios |
| POST | /api/reservations | sala_id, fecha, hora_inicio, hora_fin |
| DELETE | /api/reservations/:id | Cancelar una reserva propia |

## Verificación

`pnpm test` ejecuta una prueba de integración sobre la base configurada, con usuarios temporales que se eliminan al terminar. Requiere migraciones aplicadas y puerto local disponible. Comprueba cookies, hash, JWT vencido, DTO, autorización y solicitudes concurrentes. Reservas de prueba: 15 de octubre de 2099.
