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
