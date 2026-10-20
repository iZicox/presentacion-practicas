# CRM Interno · Frontend

SPA en **React + TypeScript + Vite** con **Bootstrap** para el CRM interno.
Durante la fase de diseño funciona como **prototipo con datos ficticios en memoria**: todavía no existe backend.

## Puesta en marcha

```bash
pnpm install --ignore-workspace   # la carpeta crm/ contiene un workspace de pnpm para Wrangler
pnpm dev                          # servidor de desarrollo en http://localhost:5173
```

Otros comandos:

```bash
pnpm build    # tsc + vite build
pnpm lint     # eslint
pnpm preview  # sirve la compilación de producción
```

## Modo prototipo (datos mock)

La capa de datos vive en `src/services/`:

| Archivo | Función |
| --- | --- |
| `api.ts` | Punto único de acceso a los datos. Hoy exporta la implementación en memoria. |
| `mockApi.ts` | API simulada en memoria: listar, crear y editar con las validaciones previstas para el backend (nombre obligatorio, formato de correo, referencias a catálogos y contacto que debe pertenecer a la empresa). |
| `mockData.ts` | Datos ficticios de ejemplo: 14 empresas, 16 contactos, 33 interacciones y 44 compras, con catálogos de segmentos, estados y tipos de cliente. |

- Los cambios (nueva empresa, contacto, interacción o compra) se guardan **en memoria**: al recargar la página todo vuelve al estado inicial. La interfaz lo indica con el aviso «Datos ficticios · modo demo».
- Las respuestas tienen 250 ms de latencia simulada para que se vean los estados de carga.
- Los importes se guardan en céntimos y se muestran e introducen en euros, siguiendo la convención española (`1.234,56`). La conversión rechaza formatos inválidos y valores con más de dos decimales.

## Conectar el backend cuando exista

1. Crear `src/services/realApi.ts` con las mismas funciones que `mockApi` usando `fetch` contra `/api/...` (contrato en `AGENTS.md`).
2. En `src/services/api.ts`, exportar `realApi` en lugar de `mockApi`. Las páginas no cambian: solo consumen `api`.
3. El error de la API (`ApiError` en `src/services/http.ts`) ya reproduce el contrato de error propuesto: `{ error: { code, message, fields? } }`.

## Estructura

```text
src/
├── components/
│   ├── common/        # PageHeader, Modal, Tabs, StatCard, Avatar, SoftBadge, iconos…
│   ├── companies/     # Tabla y formulario de empresas
│   ├── contacts/      # Lista y formulario de contactos
│   ├── interactions/  # Línea temporal y formulario de interacciones
│   └── purchases/     # Tabla y formulario de compras
├── layouts/AppLayout.tsx
├── pages/             # Inicio (panel), Empresas, Ficha de empresa, 404
├── services/          # api.ts, mockApi.ts, mockData.ts, http.ts
├── types/index.ts     # Tipos del dominio (UPPER_SNAKE_CASE, como el esquema SQL)
├── utils/             # Formato de importes/fechas, etiquetas de estado
└── styles.css         # Identidad visual propia sobre Bootstrap
```

## Rutas

- `/` — panel de inicio: indicadores, compras por mes, empresas por estado y actividad reciente.
- `/companies` — listado con búsqueda, filtros por estado y segmento, y paginación.
- `/companies/:id` — ficha de empresa: contactos, interacciones, compras (con indicadores) y datos generales.
