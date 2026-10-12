# API JWT

API pequeña de autenticación con **JWT** (solo token de acceso, sin refresh). Los usuarios se guardan en un archivo `db.json` y las contraseñas se almacenan **solo como hash** con bcrypt.

Es el paso previo del esquema de la práctica: aquí se comprueba el login con JWT. Luego, el mismo token se puede validar desde el servidor intermedio y desde la API del ERP.

## Requisitos

- Node.js 18 o superior
- [pnpm](https://pnpm.io/) como gestor de paquetes (no usar npm ni yarn)

## Instalación

```bash
# 1. Entrar en la carpeta
cd api/jwt

# 2. Instalar dependencias
pnpm install

# 3. Crear el archivo de configuración local
cp .env.example .env
```

Abre `.env` y rellena `JWT_SECRET` con algo **largo y aleatorio** (por ejemplo, lo que genere [https://djecode.com/token](https://djecode.com/token)). El archivo `.env` está en `.gitignore`: nunca se sube al repositorio.

| Variable     | Para qué sirve                                              | Ejemplo        |
|--------------|-------------------------------------------------------------|----------------|
| `JWT_SECRET` | Secreto con el que se firman y verifican los tokens. Obligatorio. | `a3f1...9zq` |
| `PORT`       | Puerto del servidor (por defecto `3000`)                    | `3001`         |
| `NODE_ENV`   | `production` = cookie solo por HTTPS. `development` = permite http en local | `development` |

Si falta `JWT_SECRET`, el servidor no arranca y avisa por consola.

## Arrancar el servidor

```bash
# en desarrollo (se reinicia solo al guardar cambios)
pnpm dev

# en producción
pnpm start
```

El servidor escucha solo en `127.0.0.1` (no expuesto a la red local ni a internet) en el puerto indicado. Verás en consola:

```
API escuchando en http://127.0.0.1:3001
```

## Cómo usar la API

El token viaja en una **cookie** llamada `token` (`httpOnly`, `sameSite: strict`). El navegador la manda sola en cada petición; el JavaScript de la página no puede leerla. En local (http) la cookie se envía con `secure: false` para poder probarla.

### 1. Registro — `POST /register`

Crea el usuario y ya lo deja logueado (devuelve la cookie).

```bash
curl -i -X POST http://127.0.0.1:3001/register \
  -H "Content-Type: application/json" \
  -d '{"username":"ana","password":"contraseña-segura"}' \
  -c cookies.txt
```

Respuesta `201`:

```json
{ "message": "usuario creado" }
```

Errores: `400` si faltan campos, `409` si el usuario ya existe.

### 2. Login — `POST /login`

Comprueba usuario y contraseña y entrega el token en la cookie.

```bash
curl -i -X POST http://127.0.0.1:3001/login \
  -H "Content-Type: application/json" \
  -d '{"username":"ana","password":"contraseña-segura"}' \
  -c cookies.txt
```

Respuesta `200`:

```json
{ "message": "sesión iniciada" }
```

Errores: `400` si faltan campos, `401` si las credenciales son incorrectas (el mensaje es el mismo aunque el usuario no exista, para no revelar qué usuarios hay).

### 3. Ruta protegida — `GET /me`

Devuelve los datos del usuario logueado. Necesita la cookie.

```bash
curl -i http://127.0.0.1:3001/me -b cookies.txt
```

Respuesta `200`:

```json
{ "id": 1, "username": "ana" }
```

Errores: `401` si no hay cookie (`no has iniciado sesión`) o si el token es inválido o caducado (`token inválido o caducado`).

> El token dura **1 hora**. Pasado ese tiempo vuelves a hacer `/login`.

### Probar con Postman

Postman guarda la cookie sola, no hay que copiarla a mano:

1. `POST /login` (o `/register`) → al recibir la respuesta, Postman almacena la cookie `token` en su almacén de cookies.
2. `GET /me` en el mismo host → Postman envía la cookie automáticamente.

Para ver o borrar la cookie: el enlace **«Cookies»** bajo el botón *Send* → *Manage Cookies* → dominio `127.0.0.1`. Útil para forzar un `401` cuando el token caduca (dura 1 hora).

Notas:

- Usa siempre el mismo host (`127.0.0.1:3001` o `localhost:3001`): la cookie está guardada por dominio, no se comparte entre uno y otro.
- La cookie aparece con el prefijo `#HttpOnly_` en la lista; es normal, Postman la envía igualmente.

## Estructura de archivos

```
api/jwt/
├── index.js        # la API: rutas, middleware de auth y cookie
├── db.js           # lectura/escritura del archivo db.json
├── db.json         # usuarios (solo el hash de la contraseña, nunca en claro)
├── .env            # configuración local (no se sube al repo)
├── .env.example    # plantilla para copiar a .env
└── package.json    # dependencias y scripts
```

## Cómo funciona por dentro (resumen)

1. **Contraseñas**: con `bcrypt.hash(password, 10)`. En `db.json` solo se guarda el hash; no hay forma de recuperar la contraseña original.
2. **Token**: `jwt.sign({ id, username }, JWT_SECRET, { expiresIn: "1h" })`, guardado en la cookie.
3. **Protección de rutas**: el middleware `auth` verifica la cookie con `jwt.verify` y, si es válida, deja pasar la petición con los datos del usuario en `req.user`.
4. **Cookies seguras**: `httpOnly` (no legible desde JS, anti XSS), `secure` en producción (solo HTTPS) y `sameSite: strict` (anti CSRF).

## Notas de seguridad

- Nunca subir `.env` ni `db.json` con usuarios reales al repositorio.
- Los errores no filtran detalles internos.
- Si en el futuro se valida este token desde otra API (intermedia o ERP), hay que usar el **mismo `JWT_SECRET`** en todas ellas.
