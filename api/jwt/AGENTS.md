# AGENTS.md — Proyecto `api/jwt`

Contexto específico de esta API (la autenticación con JWT). El contexto general del repositorio está en `../AGENTS.md`.

## Qué es

API de autenticación con Express y JWT:

- `POST /register` → crea el usuario (hash bcrypt en `db.json`) y deja la cookie `token`.
- `POST /login` → comprueba credenciales y entrega la cookie `token`.
- `GET /me` → ruta protegida: solo pasa con cookie válida.

El token viaja en una cookie `httpOnly`, `sameSite: strict`, `secure` en producción. Dura 1 hora.

## Archivos

- `index.js` → la API: rutas, middleware `auth`, cookie.
- `db.js` → lee/escribe `db.json`.
- `db.json` → usuarios (solo hashes).
- `.env` → `JWT_SECRET`, `PORT`, `NODE_ENV` (nunca en el repo).

## Regla del README

**Cada vez que se haga un cambio en este proyecto, el `README.md` debe quedar actualizado.**

- Añadir endpoints nuevos: método, ruta, ejemplo de uso y códigos de respuesta.
- Cambiar variables de entorno: actualizar la tabla de `.env`.
- Cambiar scripts, dependencias o estructura: reflejarlo en esas secciones.
- Cambiar duración del token, opciones de cookie o comportamiento de auth: ajustar la sección «Cómo funciona por dentro» y «Notas de seguridad» si aplica.
- El README describe **cómo usar el programa**, no el código interno línea a línea. Si un cambio no afecta al uso, basta con comprobar que nada del README queda desactualizado.

Si no estás seguro de si el README necesita cambios, léelo entero antes de terminar la tarea y corrige lo que haga falta.

## Cómo trabajamos

- Simple primero. Sin librerías ni documentos «por si acaso».
- Solo **pnpm**.
- Sin secretos en el código: solo variables de entorno.
- Consultas a `db.json` siempre parametrizadas por estructura (objeto `users`), nunca concatenando JSON a mano.
- Explicar en lenguaje claro: quien desarrolla es un programador junior.
