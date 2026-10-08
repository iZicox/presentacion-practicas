# AGENTS.md

Contexto del proyecto para todos los agentes. Aquí está **qué se construye y cómo encajan las piezas**. Los detalles de cada parte están en su agente (`.opencode/agents/`).

## Qué se construye

Una tienda **WordPress / WooCommerce** debe mostrar el **stock** de cada producto en su página, **solo a usuarios con sesión iniciada**. El stock está en la base de datos de un **ERP** que está en una red privada y no debe quedar expuesta a Internet. La integración es de **solo lectura**.

## Cómo encajan las piezas

```
WordPress  →  API Intermedia  →  Túnel Cloudflare  →  API del ERP  →  BD del ERP
(PHP)         (Hono, Node)       (cloudflared)         (Hono, Node)
```

| Pieza | Qué hace | Agente |
|---|---|---|
| WordPress | Si el usuario está logueado, pide el stock y lo muestra | `@wordpress` |
| API Intermedia | Comprueba el token de WordPress y reenvía la petición al ERP | `@api` |
| Túnel Cloudflare | Conecta con el ERP sin abrir puertos | `@tunnel` |
| API del ERP | Consulta el stock en la BD y lo devuelve | `@api` |

## Contrato de la API

Es el mismo en las dos APIs (la intermedia y la del ERP):

- **Petición:** `GET /productos/:sku`, donde `:sku` es el SKU del producto de WooCommerce.
- **Respuesta 200:** `{ "sku": "SKU-123", "stock": 42 }`
- **Errores:** `{ "error": "mensaje corto" }` con 401 (sin permiso), 404 (SKU no existe) o 502 (el ERP no responde). Nunca se envían detalles internos.

## Autenticación (qué protege cada salto)

| Salto | Cómo se protege |
|---|---|
| Usuario → WordPress | Sesión de WordPress (`is_user_logged_in()`) |
| WordPress → API Intermedia | Cabecera `Authorization: Bearer <token>` |
| API Intermedia → Túnel | Service Token de Cloudflare Access (cabeceras `CF-Access-Client-Id` y `CF-Access-Client-Secret`) |
| API del ERP → BD | Usuario de BD que solo puede hacer `SELECT` |

## Variables de entorno (nombres)

- **WordPress** (`wp-config.php`): `ERP_API_URL`, `ERP_API_TOKEN`
- **API Intermedia:** `API_TOKEN` (el mismo valor que `ERP_API_TOKEN`), `ERP_API_URL`, `CF_ACCESS_CLIENT_ID`, `CF_ACCESS_CLIENT_SECRET`, `PORT`
- **API del ERP:** `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `PORT`

## Stack

- **WordPress:** PHP. El agente entrega un archivo `.php` que se pega en `functions.php` (mejor de un tema hijo) o en un plugin de snippets.
- **APIs:** Node.js + TypeScript con **Hono** (o Express si ya hay una API hecha con él).
- **Paquetes:** solo **pnpm** (no `npm`, `npx` ni `yarn`).

## Cómo trabajamos

- **Simple primero.** Lo mínimo que funcione. Nada de capas, librerías o documentos «por si acaso».
- **Sin documentación pesada.** No se crean ADR, OpenAPI ni informes. Este archivo y los comentarios del código bastan.
- Hablas tú directamente con el agente de la pieza que toca: `@wordpress`, `@api` o `@tunnel`. Un agente solo toca su parte; si una tarea engancha varias piezas, se parte en varias peticiones.
- Un agente = una tarea corta, hecha en una sola pasada. Si algo no está claro, pregunta una vez y sigue.
- Explica en lenguaje claro: quien desarrolla es un programador junior.
- Pregunta antes de tocar Cloudflare, la base de datos o instalar dependencias.

## Seguridad básica (no negociable)

- Ningún secreto en el código, en el repositorio ni en el frontend: solo variables de entorno.
- Todo por HTTPS. La API del ERP escucha solo en `127.0.0.1`.
- Nunca se desactiva una comprobación de seguridad, ni «temporalmente».
- Las consultas a la BD van siempre parametrizadas y la conexión es de solo lectura.
- Los errores nunca revelan nombres de tablas, rutas internas ni secretos.