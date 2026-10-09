# Cheat sheet: crear y gestionar una base Cloudflare D1

Ejemplo: base `leds-crm`, con tablas `clientes` y `contactos`.

> **Importante:** `--remote` ejecuta los cambios en Cloudflare.
> `--local` trabaja sobre una base local independiente.
> Las dos bases no se sincronizan automáticamente.

## 1. Preparar la carpeta de trabajo

Si ya tienes un proyecto:

    cd ~/presentacion-practicas/crm

Si empiezas desde cero:

    mkdir leds-d1
    cd leds-d1
    npm init -y
    npm install --save-dev wrangler@latest

Ejecuta los siguientes comandos desde la carpeta del proyecto.

## 2. Comprobar el acceso a Cloudflare

    npx wrangler whoami

Si no estás autenticado:

    npx wrangler login

Autoriza el acceso en el navegador y comprueba de nuevo:

    npx wrangler whoami

Revisa que aparece la cuenta de Cloudflare correcta.

## 3. Crear la base de datos

Este paso se hace una sola vez por base:

    npx wrangler d1 create leds-crm

Guarda el `database_id` que devuelve el comando.

Si Wrangler ofrece añadir la configuración al proyecto, puedes aceptar.

## 4. Configurar el proyecto

Utiliza el archivo de configuración que ya tenga tu proyecto.
No dupliques la configuración si Wrangler ya la añadió.

### Opción A: wrangler.toml

Crea o edita `wrangler.toml`:

    name = "leds-d1"

    [[d1_databases]]
    binding = "DB"
    database_name = "leds-crm"
    database_id = "PEGA-AQUI-EL-ID-REAL"

### Opción B: wrangler.jsonc

Añade `d1_databases` dentro del objeto principal, conservando los demás campos:

    {
      "d1_databases": [
        {
          "binding": "DB",
          "database_name": "leds-crm",
          "database_id": "PEGA-AQUI-EL-ID-REAL"
        }
      ]
    }

### Significado de los campos

- `binding`: nombre utilizado por un Worker para acceder a la base, por ejemplo `env.DB`.
- `database_name`: nombre de la base en Cloudflare.
- `database_id`: identificador único devuelto al crear la base.

## 5. Crear el archivo de tablas

Crea un archivo llamado `schema.sql` en la carpeta del proyecto:

    CREATE TABLE IF NOT EXISTS clientes (
        id INTEGER PRIMARY KEY,
        nombre TEXT NOT NULL,
        cif TEXT UNIQUE,
        ciudad TEXT,
        web TEXT,
        fecha_creacion TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS contactos (
        id INTEGER PRIMARY KEY,
        cliente_id INTEGER NOT NULL,
        nombre TEXT NOT NULL,
        email TEXT,
        telefono TEXT,
        cargo TEXT,
        fecha_creacion TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (cliente_id) REFERENCES clientes(id)
    );

    CREATE INDEX IF NOT EXISTS idx_contactos_cliente
    ON contactos(cliente_id);

### Relación entre las tablas

    clientes.id  ←  contactos.cliente_id

Un cliente puede tener varios contactos.

Este archivo crea la estructura, pero no inserta registros.

## 6. Crear las tablas en Cloudflare

    npx wrangler d1 execute leds-crm --remote --file=./schema.sql

Revisa y acepta la confirmación que aparezca.

Cuando termina correctamente, las instrucciones ya se han ejecutado en la base de Cloudflare.

No necesitas ejecutar `wrangler deploy` para guardar las tablas.

## 7. Comprobar la base desde la terminal

### Prueba rápida de acceso

    npx wrangler d1 execute leds-crm --remote --command="SELECT 1 AS prueba;"

### Listar las tablas

    npx wrangler d1 execute leds-crm --remote --command="SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name;"

### Ver las columnas de clientes

    npx wrangler d1 execute leds-crm --remote --command="PRAGMA table_info(clientes);"

### Ver las relaciones de contactos

    npx wrangler d1 execute leds-crm --remote --command="PRAGMA foreign_key_list(contactos);"

### Consultar registros

    npx wrangler d1 execute leds-crm --remote --command="SELECT * FROM clientes LIMIT 20;"

Si la tabla está vacía, la consulta no devolverá registros.

## 8. Ver las tablas desde el navegador

1. Entra en el panel de Cloudflare.
2. Selecciona la cuenta correcta.
3. Abre `D1 SQL database`.
4. Selecciona `leds-crm`.
5. Entra en `Tables`.
6. Selecciona una tabla para consultar su contenido.

Si ya tenías el panel abierto, actualiza la página.

### Ejecutar SQL desde el panel

1. Abre `leds-crm`.
2. Entra en `Console`.
3. Pega la consulta o las instrucciones SQL.
4. Pulsa `Execute`.

Ejemplo para revisar las columnas:

    PRAGMA table_info(clientes);

Ejemplo para consultar clientes:

    SELECT * FROM clientes LIMIT 20;

## 9. Crear más tablas

Puedes hacerlo desde `Console` o mediante otro archivo SQL.

Ejemplo de una tabla de productos:

    CREATE TABLE IF NOT EXISTS productos (
        id INTEGER PRIMARY KEY,
        referencia TEXT NOT NULL UNIQUE,
        descripcion TEXT,
        marca TEXT
    );

Si guardas la instrucción en `productos.sql`, ejecútala así:

    npx wrangler d1 execute leds-crm --remote --file=./productos.sql

> Editar un `CREATE TABLE IF NOT EXISTS` y volver a ejecutarlo
> no modifica una tabla existente. Solo crea la tabla si todavía no existe.

## 10. Representar el esquema como un diagrama

Para visualizar las relaciones:

1. Abre `dbdiagram.io`.
2. Crea un diagrama.
3. Pega este código DBML:

    Table clientes {
      id integer [pk]
      nombre text [not null]
      cif text [unique]
      ciudad text
      web text
      fecha_creacion text [not null, default: `CURRENT_TIMESTAMP`]
    }

    Table contactos {
      id integer [pk]
      cliente_id integer [not null]
      nombre text [not null]
      email text
      telefono text
      cargo text
      fecha_creacion text [not null, default: `CURRENT_TIMESTAMP`]

      indexes {
        cliente_id
      }
    }

    Ref: contactos.cliente_id > clientes.id

El diagrama representa las tablas y su relación.

> Este diagrama es independiente de D1.
> Pegar el DBML no crea tablas ni conecta la herramienta con la base.
> Si cambias el esquema en D1, actualiza también el diagrama.

## 11. Resolver el error de autenticación 10000

Si aparece:

    Authentication error [code: 10000]

### Paso 1: renovar la sesión

    npx wrangler logout
    npx wrangler login
    npx wrangler whoami

Autoriza Wrangler con la cuenta correcta.

### Paso 2: probar una consulta pequeña

    npx wrangler d1 execute leds-crm --remote --command="SELECT 1 AS prueba;"

### Paso 3: repetir la importación

Si la consulta funciona:

    npx wrangler d1 execute leds-crm --remote --file=./schema.sql

No borres ni recrees la base para renovar la autenticación.

### Si el error continúa

Comprueba si existen variables de credenciales.
Este comando muestra únicamente sus nombres, no sus valores:

    printenv | cut -d= -f1 | grep -E '^(CLOUDFLARE_|CF_)'

Busca también archivos `.env` en la carpeta actual:

    find . -maxdepth 1 -type f -name '.env*' -print

Si quieres probar con OAuth y tienes tokens definidos en la terminal:

    unset CLOUDFLARE_API_TOKEN
    unset CF_API_TOKEN

Si esos tokens también están definidos en un archivo `.env`,
comenta temporalmente sus líneas antes de repetir la prueba.

No compartas tokens ni el contenido del archivo de credenciales de Wrangler.

### Alternativa para avanzar

Ejecuta el contenido del archivo SQL desde:

    Cloudflare → D1 SQL database → leds-crm → Console → Execute

## 12. Comandos esenciales

| Acción | Comando |
|---|---|
| Comprobar sesión | `npx wrangler whoami` |
| Iniciar sesión | `npx wrangler login` |
| Cerrar sesión | `npx wrangler logout` |
| Crear una base | `npx wrangler d1 create leds-crm` |
| Ejecutar un archivo en Cloudflare | `npx wrangler d1 execute leds-crm --remote --file=./schema.sql` |
| Probar acceso remoto | `npx wrangler d1 execute leds-crm --remote --command="SELECT 1 AS prueba;"` |
| Consultar clientes | `npx wrangler d1 execute leds-crm --remote --command="SELECT * FROM clientes LIMIT 20;"` |
| Ver columnas | `npx wrangler d1 execute leds-crm --remote --command="PRAGMA table_info(clientes);"` |
| Ver relaciones | `npx wrangler d1 execute leds-crm --remote --command="PRAGMA foreign_key_list(contactos);"` |

## 13. Checklist final

- [ ] Estoy en la carpeta correcta del proyecto.
- [ ] Wrangler está autenticado con la cuenta correcta.
- [ ] La base existe en Cloudflare.
- [ ] El archivo de configuración contiene el `database_id` correcto.
- [ ] El archivo SQL está guardado.
- [ ] He ejecutado el archivo con `--remote`.
- [ ] El comando ha terminado sin errores.
- [ ] Las tablas aparecen en el panel de Cloudflare.
- [ ] He comprobado las columnas y relaciones.
- [ ] Si utilizo un diagrama independiente, lo he actualizado.
