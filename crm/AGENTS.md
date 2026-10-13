# AGENTS.md

## Objetivo del proyecto

Construir un CRM interno para gestionar empresas, contactos, interacciones comerciales y compras.

Desarrollar por funcionalidades completas: implementar una parte del backend, conectarla con el frontend y verificar el recorrido hasta la base de datos antes de avanzar.

Priorizar la sencillez. No añadir funcionalidades, tablas, dependencias ni capas arquitectónicas que no sean necesarias para el alcance definido.

## Stack tecnológico

- Frontend: React + TypeScript + Vite.
- Estilos: Bootstrap y CSS propio para ajustes puntuales.
- Backend: Express + TypeScript ejecutado en Cloudflare Workers.
- Base de datos: Cloudflare D1.
- Desarrollo y despliegue del backend: Wrangler.
- Control de versiones: Git.

Utilizar la integración compatible de Express con Cloudflare Workers. No asumir que Workers es un servidor Node.js tradicional.

Acceder a D1 mediante el binding `DB` del Worker. No utilizar credenciales de la API de Cloudflare desde el navegador.

## Idioma y convenciones

- Código, archivos, tablas, columnas y rutas: inglés.
- Textos visibles en la interfaz y explicaciones al usuario: español.
- Componentes React: `PascalCase`.
- Variables y funciones: `camelCase`.
- Tablas y columnas SQL: `UPPER_SNAKE_CASE`, siguiendo el esquema aprobado.
- No renombrar entidades existentes sin autorización.
- Utilizar TypeScript tanto en frontend como en backend.
- Evitar `any`; definir tipos explícitos para entradas, respuestas y registros.
- Los tipos de TypeScript no sustituyen la validación de los datos recibidos en ejecución.

## Estructura del proyecto

```text
crm-internal/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── Layout.tsx
│   │   ├── pages/
│   │   │   ├── CompaniesPage.tsx
│   │   │   └── CompanyDetailPage.tsx
│   │   ├── services/
│   │   │   └── api.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── styles.css
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   │   ├── companies.ts
│   │   │   ├── contacts.ts
│   │   │   ├── interactions.ts
│   │   │   ├── purchases.ts
│   │   │   └── catalogs.ts
│   │   ├── middleware/
│   │   │   └── auth.ts
│   │   ├── utils/
│   │   │   ├── responses.ts
│   │   │   └── validation.ts
│   │   ├── app.ts
│   │   ├── index.ts
│   │   └── types.ts
│   ├── migrations/
│   │   └── 0001_initial_schema.sql
│   ├── test/
│   ├── package.json
│   ├── tsconfig.json
│   └── wrangler.jsonc
├── .gitignore
├── AGENTS.md
└── README.md
```

Esta estructura es una referencia. Crear cada archivo cuando se implemente su funcionalidad; no generar archivos vacíos únicamente para completar el árbol.

Antes de modificar el proyecto, inspeccionar los archivos existentes y respetar su organización.

## Arquitectura

```text
Frontend React
    │
    │ HTTP /api/...
    ▼
Backend Express en Cloudflare Workers
    │
    │ Binding DB
    ▼
Cloudflare D1
```

### Frontend

- Presentar datos y recoger entradas del usuario.
- Centralizar las solicitudes HTTP en `services/api.ts`.
- No ejecutar SQL ni acceder directamente a D1.
- No incluir secretos, tokens de Cloudflare ni credenciales de base de datos.
- Utilizar Bootstrap sin incorporar inicialmente otra biblioteca de componentes.
- No añadir gestores globales de estado si el estado local resulta suficiente.
- Mostrar estados de carga, error, éxito y ausencia de datos.
- Conservar los valores del formulario si una solicitud falla.
- Evitar envíos duplicados mientras una operación está en curso.
- Priorizar la ficha de empresa como lugar para consultar contactos, interacciones y compras.

### Backend

- `app.ts`: configuración de Express y registro de rutas.
- `index.ts`: integración con el entorno de Cloudflare Workers.
- `routes/`: operaciones agrupadas por entidad.
- `types.ts`: tipos del backend y del entorno, incluido `DB`.
- Validar entradas y relaciones antes de escribir en D1.
- Utilizar consultas parametrizadas.
- No construir SQL concatenando entradas del usuario.
- Mantener un formato consistente de respuestas y errores.
- No exponer mensajes internos, consultas SQL ni secretos en errores públicos.
- No añadir capas de controladores, servicios y repositorios hasta que exista una necesidad concreta.

## Modelo de datos aprobado

### SEGMENT

```text
ID
NAME
DESCRIPTION
CREATED_AT
```

### STATUS

Representa el estado comercial de la empresa o lead.

```text
ID
NAME
DESCRIPTION
ORDER
CREATED_AT
```

El campo `"ORDER"` debe escribirse entre comillas dobles en SQL.

### CLIENT_TYPE

```text
ID
NAME
DESCRIPTION
CREATED_AT
```

### COMPANY

```text
ID
NAME
SEGMENT_ID
STATUS_ID
CLIENT_TYPE_ID
EMAIL
PHONE_NUMBER
WEB
NOTES
CREATED_AT
UPDATED_AT
```

### CONTACT

```text
ID
COMPANY_ID
FIRST_NAME
LAST_NAME
JOB_TITLE
EMAIL
PHONE_NUMBER
NOTES
CREATED_AT
UPDATED_AT
```

### INTERACTION

Registro simple de seguimiento comercial.

```text
ID
COMPANY_ID
CONTACT_ID
DATE
DESCRIPTION
NOTES
CREATED_AT
UPDATED_AT
```

### PURCHASE

Registro simple del valor de cada compra.

```text
ID
COMPANY_ID
DATE
AMOUNT_CENTS
CREATED_AT
```

### Claves y relaciones

- `ID` es la única clave primaria de cada tabla.
- `COMPANY_ID` en `CONTACT` y `PURCHASE` es únicamente clave foránea.
- Una empresa puede tener múltiples contactos, interacciones y compras.
- Una interacción requiere una empresa.
- El contacto de una interacción es opcional.
- Si se proporciona un contacto, debe pertenecer a la empresa de la interacción.
- `SEGMENT_ID`, `STATUS_ID` y `CLIENT_TYPE_ID` pueden ser nulos.

### Comportamiento de borrado del esquema actual

- Eliminar un segmento, estado o tipo de cliente deja la referencia de la empresa en `NULL`.
- Eliminar una empresa elimina sus contactos, interacciones y compras mediante cascada.
- Eliminar un contacto deja `CONTACT_ID` en `NULL` en sus interacciones.

No cambiar estas reglas ni implementar borrados destructivos sin autorización.

## Límites funcionales

### Interacciones

- No añadir tipos de interacción.
- No añadir estados de actividad.
- No añadir `COMPLETED_AT`.
- No implementar gestión de pendientes, completadas o canceladas.
- No presentar la fecha como evidencia automática de realización.
- Mantener descripción y notas como campos separados, conforme al esquema aprobado.

### Compras

- Registrar únicamente empresa, fecha e importe, además de los metadatos aprobados.
- Una fila representa una compra individual, no un resumen mensual.
- No añadir productos ni líneas de detalle.
- No añadir abonos, estados, tipos de documento, impuestos, descuentos ni control de pagos.
- No convertir el CRM en un sistema de facturación.
- No inferir compras a partir de interacciones.
- No construir importaciones hasta conocer un archivo o formato real del software de origen.

## Importes y fechas

### Importes

- Guardar los importes en `AMOUNT_CENTS` como enteros no negativos.
- Mostrar e introducir importes en euros.
- Ejemplo: `250,50 €` corresponde a `25050`.
- Validar la conversión a céntimos; no truncar silenciosamente decimales.
- Rechazar valores no numéricos, negativos o fuera del rango admitido.
- Definir y documentar un único criterio sobre inclusión de IVA antes de cargar compras reales.
- No añadir un campo de moneda mientras el alcance sea exclusivamente en euros.

### Fechas

- `PURCHASE.DATE`: fecha real de compra.
- `INTERACTION.DATE`: fecha de la interacción.
- Usar `YYYY-MM-DD` para estos campos salvo cambio aprobado.
- No sustituir una fecha ausente por la fecha actual sin indicación del usuario.
- `CREATED_AT`: momento de registro.
- `UPDATED_AT`: momento de última modificación.
- Actualizar `UPDATED_AT` explícitamente desde el backend.
- No utilizar `CREATED_AT` para calcular la última compra.

## API propuesta

### Comprobación de conexión

```text
GET /api/health
```

Verificar que el backend puede consultar D1. No devolver configuración sensible.

### Empresas

```text
GET   /api/companies
GET   /api/companies/:id
POST  /api/companies
PATCH /api/companies/:id
```

### Catálogos

```text
GET /api/segments
GET /api/statuses
GET /api/client-types
```

Incorporar escritura de catálogos cuando se desarrolle la pantalla de configuración.

### Contactos

```text
GET   /api/companies/:id/contacts
POST  /api/companies/:id/contacts
PATCH /api/contacts/:id
```

### Interacciones

```text
GET   /api/companies/:id/interactions
POST  /api/companies/:id/interactions
PATCH /api/interactions/:id
```

### Compras

```text
GET   /api/companies/:id/purchases
POST  /api/companies/:id/purchases
PATCH /api/purchases/:id
GET   /api/companies/:id/purchase-summary
```

### Respuestas

Formato propuesto para éxito:

```json
{
  "data": {}
}
```

Formato propuesto para error:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Revisa los datos introducidos.",
    "fields": {}
  }
}
```

- Respetar el contrato existente si ya se ha implementado otro formato.
- Distinguir errores de validación, acceso, registro inexistente y fallo interno.
- En `PATCH`, diferenciar un campo omitido de uno enviado explícitamente como `null`.
- Permitir únicamente campos autorizados.
- Validar los identificadores y las referencias a catálogos.
- No añadir rutas de borrado en la primera versión.

## Indicadores de compras

Implementar inicialmente:

- Total comprado en un periodo.
- Número de compras en ese periodo.
- Importe medio por compra.
- Fecha de última compra.

Reglas:

- Calcular a partir de `PURCHASE`, nunca de `INTERACTION`.
- Devolver importes monetarios en céntimos.
- Definir explícitamente si la fecha de última compra corresponde al periodo filtrado o a todo el historial.
- Sin compras: total y número de compras iguales a cero; importe medio y última fecha nulos.
- Para filtros de fecha, documentar límites y mantener el mismo criterio en todas las consultas.
- No sumar importes de clientes distintos por error al consultar una ficha.

## Orden de implementación

### Etapa 1: conexión inicial

- Preparar frontend y backend.
- Configurar la integración Express–Workers.
- Configurar el binding D1.
- Preparar el esquema local.
- Implementar `/api/health`.
- Mostrar el resultado desde React.

Criterio de aceptación: una petición desde el frontend verifica la conexión del backend con D1.

### Etapa 2: listado de empresas

- Implementar `GET /api/companies`.
- Mostrar la tabla con Bootstrap.
- Incluir carga, error y lista vacía.

Criterio de aceptación: los registros de D1 se muestran correctamente.

### Etapa 3: creación de empresas

- Implementar `POST /api/companies`.
- Crear formulario.
- Validar y actualizar la lista.

Criterio de aceptación: la empresa creada permanece después de recargar.

### Etapa 4: ficha y edición

- Implementar consulta y modificación por ID.
- Crear la ficha de empresa.
- Incorporar catálogos y selectores.
- Actualizar `UPDATED_AT`.

Criterio de aceptación: editar datos y clasificación desde la interfaz.

### Etapa 5: contactos

- Añadir contactos dentro de la ficha.
- Implementar creación, consulta y edición.
- Validar la empresa asociada.

Criterio de aceptación: gestionar varios contactos de una empresa.

### Etapa 6: interacciones

- Añadir historial de interacciones.
- Implementar creación y edición.
- Validar que el contacto pertenece a la empresa.

Criterio de aceptación: registrar y consultar seguimiento sin añadir gestión de tareas.

### Etapa 7: compras

- Implementar consulta, creación y edición.
- Añadir formulario de fecha e importe.
- Incorporar indicadores básicos.

Criterio de aceptación: una compra registrada actualiza el historial y los indicadores.

### Etapa 8: mejoras de uso

- Búsqueda de empresas.
- Filtros por clasificación.
- Paginación.
- Administración de catálogos.
- Resumen mensual de compras.
- Ajustes para pantallas pequeñas.

### Etapa 9: acceso y publicación

- Implementar acceso restringido.
- Proteger la API.
- Probar en un entorno separado.
- Publicar y verificar con datos ficticios.
- Cargar datos reales únicamente después de validar el acceso.

## Seguridad

- No publicar rutas con datos comerciales sin control de acceso.
- Ocultar botones no sustituye la autorización del backend.
- No desarrollar inicialmente un sistema propio de contraseñas.
- Elegir el mecanismo de autenticación antes de utilizar datos reales.
- No aceptar cabeceras de identidad sin verificar su procedencia y autenticidad.
- No utilizar CORS como sustituto de autenticación.
- Restringir los orígenes si frontend y backend se publican por separado.
- No guardar secretos en variables públicas de Vite.
- No registrar información sensible innecesaria en logs.
- Usar únicamente datos ficticios durante el desarrollo inicial.

## Base de datos y migraciones

- Mantener separados los datos locales, de pruebas y de producción.
- No asumir que ejecutar SQL en local modifica D1 remoto.
- Revisar el entorno objetivo antes de aplicar comandos.
- Crear migraciones incrementales para cambios posteriores.
- No editar migraciones ya aplicadas para introducir cambios nuevos.
- Si el esquema se creó manualmente, revisar su estado antes de configurar el historial de migraciones.
- `CREATE TABLE IF NOT EXISTS` no modifica tablas existentes.
- No utilizar `DROP TABLE`, borrar bases ni eliminar registros para resolver errores sin autorización.
- No ejecutar cambios remotos ni desplegar a producción sin autorización expresa.

## Pruebas y criterios de calidad

Antes de dar por terminada una funcionalidad:

1. Verificar los tipos y compilar.
2. Ejecutar las pruebas disponibles.
3. Comprobar el recorrido frontend → backend → D1.
4. Probar entradas válidas e inválidas.
5. Comprobar registros inexistentes y listas vacías.
6. Verificar que un contacto de otra empresa sea rechazado.
7. Comprobar la conversión y presentación de importes.
8. Recargar la pantalla y comprobar la persistencia.
9. Actualizar el README si cambia la configuración.

Usar los comandos definidos en `package.json`. No afirmar que una prueba se ha ejecutado si no se ha realizado.

## Forma de trabajo del agente

- Inspeccionar el proyecto antes de proponer modificaciones.
- Trabajar únicamente en la etapa o funcionalidad solicitada.
- Realizar cambios pequeños y verificables.
- No cambiar el stack ni ampliar el alcance sin aprobación.
- No incorporar dependencias por conveniencia sin explicar su necesidad.
- No generar datos de prueba en producción.
- No hacer commits, push ni despliegues sin solicitud expresa.
- Al finalizar una tarea, indicar:
  - Qué se implementó.
  - Qué archivos se modificaron.
  - Qué comprobaciones se realizaron.
  - Qué queda pendiente.
- Si falta una decisión que afecta al modelo de datos o al acceso, solicitar una aclaración concreta en lugar de inventar requisitos.