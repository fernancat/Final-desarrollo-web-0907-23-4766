# Prompts

## Prompt inicial

```text
Contexto general de la aplicacion: Se debe de construir una aplicacion web para reservar salas de una biblioteca.

Stack obligatorio que debes de seguir: Node Js (solo js no TS ni para el backend ni para el frontend), Sequlize como ORM, react, Base de datos postgresql la tengo montada en un contenedor las credenciale son user: fernan contraseña: 123456 en el puerto 5455


Debes de comenzar con un flujo de desarrollo de abajo hacia arriba, el esquema propuesto para la base de datos es:


Usuarios(
    Nombre
    Apellidos
    correo
    contrasena_hash

)


Salas(
    fecha
     hora inicio
     hora fin

)


Esta es una tabla pivot entre usuarios y Salas para la asignacion de las reservas (si me equivoco corrige)
reservacion (no deben de haber solapaciones ten cuidado con eso) (

    
)


Como nota final: no vayas a agregar propiedades que no sean afines y que no aporten nada a la complejidad actual



Para el backend una estructura basica dividida por modulos enfocada en dominio, por ejemplo:



/modules
    /user
        /repository
        /service
        /controller

para el resto lo unico que ocuparias seria


    /infrastructure
        /db 
            /migrations (aqui deben de ir especificamente las migraciones de la base de datos enumerado por nommemclatura por ejeplo: 001_user_migration) debe de tener dos funciones una para create y otra para hacerle drop
            
            

Se utilizaran cookies para la sesion y la contrasena debe de ir hasheada, con 10 salts
debes de ir validando y haciendo DTO en lo posible para transferir y validar los datos entre capas
            
para el frontend utiliza una basada en componentes, para el desarrollo de  este no vas a necesitar ReactRouter puedes hacer renderizados condicionales perfectamente con operaadores ternario para alternar al listado de salas, y debes de hacer una validacion inicial para ver si el usuario esta autenticado

el frontend debe de tener el login, register , la sesion debe de expirar a los 30 min de actividad que debe de redirigir al login con 401  ah y por cierto se me olvidaba aunque ya sabes debes de crear el formulario para hacer la reserva de la sala, se me ocurre que las salas puedes ponerlas en un grid de tipo pelicula 

        
        
Normas  para el codigo:

1. No hagas ONE SHOT LINE , con esto me refiero es que agregues codigo ilegible que haga muchas operaciones en una sola linea, el codigo debe ser legible a primera vista
2. Todo se debe de ver uniforme, no debes de utilizar promesas en un lado y en el otro async y await , lo ideal es que solo usaras asyn y await porque el codigo es potencialmente mas legible
3. Haz espaciados entre el codigo, separa bien las responsabilidades para que se distinga una operacion de otra





La ruta del proyecto esta en: ~/Documentos/Final-desarrollo-web-0907-23-4766/Backend
debes de hacer unicamente dos commits uno para el backend y una para el frontend
ah y se me olvido algo: la autenticacion es con jwt, no con base64 ni adicionales ni sesiones complejas donde tengas que crear una tabla y asi ah y no dejes repleto de comentarios el codigo, unicamente si es necesario
```
