# Frontend de reservas

React + Vite, solo JavaScript. Sin React Router: `App.jsx` alterna entre autenticación y panel con renderizado condicional.

## Inicio

Con la API corriendo en el puerto 3000 (ver `../Backend`):

```sh
pnpm install
pnpm dev
```

Abre http://localhost:5173. Vite redirige `/api` al backend, así la cookie de sesión comparte origen.

## Estructura

- `api/`: cliente `fetch` y llamadas por módulo. Cualquier 401 en una ruta autenticada cierra la sesión y vuelve al login.
- `hooks/`: `useSession` (verificación inicial con `/auth/me` y expiración a los 30 minutos de inactividad usando `X-Session-Expires-At`), `useRoomBoard` y `useMyReservations`.
- `validation/`: DTO que normalizan y validan los datos antes de enviarlos.
- `components/`: autenticación, cuadrícula de salas tipo cine, formulario de reserva y listado de reservas.

En la cuadrícula cada fila es una sala y cada asiento una hora (07:00–21:00, hora de Guatemala). Un clic elige un horario; otro clic en la misma fila amplía el rango. Las horas también se pueden ajustar manualmente en el formulario.
