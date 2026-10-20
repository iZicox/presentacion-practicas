-- =========================================================
-- auth_sessions: sesiones con refresh token rotativo.
-- =========================================================
-- created_at, expires_at y revoked_at se guardan en segundos Unix.
-- refresh_hash es el SHA-256 en hexadecimal del JWT de refresh completo.
-- revoked_at NULL significa que la sesión sigue activa.

CREATE TABLE IF NOT EXISTS auth_sessions (
    id TEXT PRIMARY KEY,
    user_id INTEGER NOT NULL,
    refresh_hash TEXT NOT NULL,
    created_at INTEGER NOT NULL,
    expires_at INTEGER NOT NULL,
    revoked_at INTEGER,

    FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_auth_sessions_user
    ON auth_sessions(user_id);

CREATE INDEX IF NOT EXISTS idx_auth_sessions_expires
    ON auth_sessions(expires_at);
