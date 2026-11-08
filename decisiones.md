# Decisiones del proyecto

Aqui dejo lo que decidi antes de pasarle el trabajo a la IA y lo que salio al revisarlo.

## 1. Que hace la aplicacion

Es una app web para reservar salas de una biblioteca. El usuario se registra, inicia sesion y aparta una sala para un dia y un horario. La regla principal es que dos reservas de la misma sala no se pueden cruzar.

Pantallas:

- Login y registro.
- Grid tipo cine: cada fila es una sala y cada asiento una hora, se ve que esta libre, ocupado o ya paso.
- Formulario de reserva: se llena tocando los asientos o escribiendo las horas.
- Mis reservas: lista lo que el usuario tiene apartado y deja cancelarlo.

## 2. Trabajo de la IA

La IA escribio el codigo siguiendo estas decisiones. Yo revise el codigo y probe la aplicacion para ver que funcionara.

Errores que encontre:

- El titulo del grid ponia mayuscula en cada palabra ("Horario Del Martes, 18 De Marzo").
- En celular la columna de nombres de sala era muy ancha y casi no se veian los asientos.
- Al terminar borro los usuarios de prueba y apago los servidores, cuando quise probar no habia nada levantado y tuve que pedirle que lo hiciera otra vez.

## 3. Base de datos

Postgresql en Docker con Sequelize. Mi primer esquema tenia la fecha y las horas en Salas, pero el horario es de la reserva y no de la sala, asi que se movieron a reservaciones.

- **usuarios:** id, nombre, apellidos, correo (unico) y contrasena_hash.
- **salas:** id y nombre. La migracion crea 4 salas.
- **reservaciones:** id, usuario_id, sala_id, fecha, hora_inicio y hora_fin. Es la tabla pivot entre usuarios y salas.

Validar el cruce solo en el backend no alcanzaba, dos peticiones al mismo tiempo podian pasar las dos. Por eso postgresql tiene una restriccion de exclusion que no deja guardar horarios cruzados en la misma sala. Reservas pegadas como 9 a 10 y 10 a 11 si se permiten.

No hay tabla de sesiones porque se usa JWT.

## 4. Backend y frontend

Todo en JavaScript, nada de TypeScript.

**Backend (Node + Express):**

- Modulos por dominio (user, room, reservation), cada uno con repository, service y controller.
- Migraciones numeradas en infrastructure/db/migrations, cada una con create y drop.
- Contrasena con bcrypt y 10 salts.
- JWT en una cookie HttpOnly. Cada peticion renueva la sesion y con 30 minutos sin actividad vence y responde 401.
- DTOs para validar los datos entre capas, el hash nunca sale en las respuestas.

**Frontend (React + Vite):**

- Basado en componentes y sin React Router, las vistas se cambian con ternarios.
- Al abrir revisa si ya hay sesion, si no muestra el login.
- Con un 401 regresa al login avisando que la sesion expiro.
