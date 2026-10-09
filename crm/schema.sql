-- =========================================================
-- SCHEMA.SQL — CRM PARA CLOUDFLARE D1
-- =========================================================
-- Tablas:
--   1. segmento
--   2. estado
--   3. tipo_cliente
--   4. empresa
--   5. contacto
--   6. interaccion
--   7. compra
--
-- interaccion unifica:
--   - Actividades pendientes
--   - Actividades completadas
--   - Actividades canceladas
--
-- D1 aplica las claves foráneas por defecto.
-- =========================================================


-- =========================================================
-- SEGMENTOS
-- =========================================================

CREATE TABLE IF NOT EXISTS segmento (
    id INTEGER PRIMARY KEY AUTOINCREMENT,

    nombre TEXT NOT NULL UNIQUE,
    descripcion TEXT,

    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);


-- =========================================================
-- ESTADOS DEL LEAD / EMPRESA
-- =========================================================

CREATE TABLE IF NOT EXISTS estado (
    id INTEGER PRIMARY KEY AUTOINCREMENT,

    nombre TEXT NOT NULL UNIQUE,
    descripcion TEXT,

    orden INTEGER NOT NULL DEFAULT 0,

    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);


-- =========================================================
-- TIPOS DE CLIENTE
-- =========================================================

CREATE TABLE IF NOT EXISTS tipo_cliente (
    id INTEGER PRIMARY KEY AUTOINCREMENT,

    nombre TEXT NOT NULL UNIQUE,
    descripcion TEXT,

    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);


-- =========================================================
-- EMPRESA
-- =========================================================

CREATE TABLE IF NOT EXISTS empresa (
    id INTEGER PRIMARY KEY AUTOINCREMENT,

    nombre TEXT NOT NULL,

    segmento_id INTEGER,
    estado_id INTEGER,
    tipo_cliente_id INTEGER,

    email TEXT,
    telefono TEXT,
    web TEXT,

    notas TEXT,

    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (segmento_id)
        REFERENCES segmento(id)
        ON DELETE SET NULL,

    FOREIGN KEY (estado_id)
        REFERENCES estado(id)
        ON DELETE SET NULL,

    FOREIGN KEY (tipo_cliente_id)
        REFERENCES tipo_cliente(id)
        ON DELETE SET NULL
);


-- =========================================================
-- CONTACTOS
-- Personas dentro de una empresa
-- =========================================================

CREATE TABLE IF NOT EXISTS contacto (
    id INTEGER PRIMARY KEY AUTOINCREMENT,

    empresa_id INTEGER NOT NULL,

    nombre TEXT NOT NULL,
    apellido TEXT,
    cargo TEXT,

    email TEXT,
    telefono TEXT,

    notas TEXT,

    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (empresa_id)
        REFERENCES empresa(id)
        ON DELETE CASCADE
);


-- =========================================================
-- INTERACCIONES
-- Actividades pendientes, completadas y canceladas
--
-- empresa_id: empresa asociada, obligatoria.
-- contacto_id: persona asociada, opcional.
-- fecha: fecha prevista de la actividad.
-- completed_at: fecha real de realización.
--
-- Si se registra una actividad que ya ocurrió:
--   - estado = 'completada'
--   - fecha = fecha de la actividad
--   - completed_at = fecha real de realización
-- =========================================================

CREATE TABLE IF NOT EXISTS interaccion (
    id INTEGER PRIMARY KEY AUTOINCREMENT,

    empresa_id INTEGER NOT NULL,
    contacto_id INTEGER,

    tipo TEXT NOT NULL,

    fecha TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,

    estado TEXT NOT NULL DEFAULT 'pendiente'
        CHECK (
            estado IN (
                'pendiente',
                'completada',
                'cancelada'
            )
        ),

    descripcion TEXT,
    resultado TEXT,
    notas TEXT,

    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    completed_at TEXT,

    FOREIGN KEY (empresa_id)
        REFERENCES empresa(id)
        ON DELETE CASCADE,

    FOREIGN KEY (contacto_id)
        REFERENCES contacto(id)
        ON DELETE SET NULL
);


-- =========================================================
-- COMPRAS
-- Historial de compras de una empresa
-- =========================================================

CREATE TABLE IF NOT EXISTS compra (
    id INTEGER PRIMARY KEY AUTOINCREMENT,

    empresa_id INTEGER NOT NULL,

    fecha TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,

    importe REAL NOT NULL DEFAULT 0,

    estado TEXT NOT NULL DEFAULT 'completada',

    notas TEXT,

    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (empresa_id)
        REFERENCES empresa(id)
        ON DELETE CASCADE
);


-- =========================================================
-- ÍNDICES DE EMPRESA
-- =========================================================

CREATE INDEX IF NOT EXISTS idx_empresa_segmento
    ON empresa(segmento_id);

CREATE INDEX IF NOT EXISTS idx_empresa_estado
    ON empresa(estado_id);

CREATE INDEX IF NOT EXISTS idx_empresa_tipo_cliente
    ON empresa(tipo_cliente_id);


-- =========================================================
-- ÍNDICES DE CONTACTO
-- =========================================================

CREATE INDEX IF NOT EXISTS idx_contacto_empresa
    ON contacto(empresa_id);


-- =========================================================
-- ÍNDICES DE INTERACCIÓN
-- =========================================================

-- Actividades de una empresa ordenadas por fecha.
CREATE INDEX IF NOT EXISTS idx_interaccion_empresa_fecha
    ON interaccion(empresa_id, fecha DESC);

-- Actividades de un contacto ordenadas por fecha.
CREATE INDEX IF NOT EXISTS idx_interaccion_contacto_fecha
    ON interaccion(contacto_id, fecha DESC);

-- Agenda y filtrado por estado y fecha.
CREATE INDEX IF NOT EXISTS idx_interaccion_estado_fecha
    ON interaccion(estado, fecha);


-- =========================================================
-- ÍNDICES DE COMPRA
-- =========================================================

CREATE INDEX IF NOT EXISTS idx_compra_empresa_fecha
    ON compra(empresa_id, fecha DESC);
