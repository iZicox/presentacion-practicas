import { Hono } from "hono";
import { z } from "zod";
import { getCookie } from "hono/cookie";

import { authMiddleware } from "./auth.middleware";
import type { AppEnv, User } from "../types";
import {
    hashPassword,
    passwordFitsBcrypt,
    verifyPassword
} from "./auth.security";

import {
  ACCESS_TTL,
  REFRESH_TTL,
  nowSeconds,
  hashToken,
  createTokenPair,
  verifyRefreshToken,
  setAuthCookies,
  clearAuthCookies,
} from "./auth.tokens";

import type { TokenIdentity } from "./auth.tokens";

const authRoutes = new Hono<AppEnv>();

// Revoca la sesión indicada en D1, solo si sigue sin revocar.
// La identidad debe venir de un token verificado.
async function revokeSession(
    db: D1Database,
    sessionId: string,
    userId: number,
): Promise<void> {
    await db
        .prepare(`
            UPDATE auth_sessions
            SET revoked_at = ?
            WHERE id = ?
              AND user_id = ?
              AND revoked_at IS NULL
        `)
        .bind(nowSeconds(), sessionId, userId)
        .run();
}

const registerSchema = z.object({
    email: z.string()
        .trim()
        .toLowerCase()
        .email()
        .max(254),

    password: z.string()
        .min(15, "la contraseña debe tener al menos 15 caracteres")
        .refine(
            passwordFitsBcrypt,
            "la contraseña no puede superar los 72 bytes"
        ),
});

authRoutes.post("/register", async (c) => {
    // comprobar que el registro esta habilitado
    if (!c.env.REGISTRATION_KEY) {
        return c.json(
            {
                error: "El registro de usuarios está deshabilitado"
            },
            403
        );
    }

    // comprobar la clave de alta
    const registrationKey = c.req.header("X-Registration-Key");

    if (registrationKey !== c.env.REGISTRATION_KEY) {
        return c.json(
            {
                error: "no estas autorizado para registrar usuarios"
            },
            403
        );
    }

    // exigir cuerpo de json
    const contentType = c.req
        .header("Content-Type")
        ?.split(";")[0]
        .trim()
        .toLowerCase();

    if (contentType !== "application/json") {
        return c.json(
            {
                error: "debes enviar los datos como json"
            },
            415
        );
    }

    // leer y validar datos
    const body = await c.req.json().catch(() => null);
    const validation = registerSchema.safeParse(body);

    if (!validation.success) {
        return c.json(
            {
                error: "datos de registro no valido",
                details: validation.error.issues.map((issue) => ({
                    field: issue.path.join("."),
                    message: issue.message
                })),
            },
            400,
        );
    }


    const { email, password } = validation.data;

    // generar hash
    const passwordHash = await hashPassword(password);

    // insertar sin sobreescribir una cuenta existente
    const result = await c.env.DB
        .prepare(`
            INSERT INTO users (
                email,
                password_hash,
                is_active
            )
            VALUES (?, ?, 1)
            ON CONFLICT(email) DO NOTHING
        `)
        .bind(email, passwordHash)
        .run();

    if (result.meta.changes === 0) {
        return c.json(
            {
                error: "ya existe el usuario"
            },
            409,
        )
    }

    // devolver solo datos publicos
    return c.json(
        {
            message: "usuario registrado",
            data: {
                id: result.meta.last_row_id,
                email
            },
        },
        201
    );




});

// verificar el esquema para el login
const loginSchema = z.object({
    email: z.string()
        .trim()
        .toLowerCase()
        .email()
        .max(254),

    password: z.string()
        .min(1)
        .refine(passwordFitsBcrypt),
});

authRoutes.post("/login", async (c) => {
    c.header("Cache-Control", "no-store");

    // 1. Comprobar el origen para evitar login CSRF.
    const origin = c.req.header("Origin");

    if (!origin || origin !== c.env.APP_ORIGIN) {
        return c.json(
            {
                error: "Origen de la petición no permitido",
            },
            403,
        );
    }

    // 2. Exigir un cuerpo JSON.
    const contentType = c.req
        .header("Content-Type")
        ?.split(";")[0]
        .trim()
        .toLowerCase();

    if (contentType !== "application/json") {
        return c.json(
            {
                error: "Debes enviar application/json",
            },
            415,
        );
    }

    // 3. Leer y validar las credenciales.
    const body = await c.req.json().catch(() => null);
    const validation = loginSchema.safeParse(body);

    if (!validation.success) {
        return c.json(
            {
                error: "Datos de acceso no válidos",
            },
            400,
        );
    }

    const { email, password } = validation.data;

    // 4. Buscar el usuario.
    const user = await c.env.DB
        .prepare(`
      SELECT id, email, password_hash, is_active, created_at
      FROM users
      WHERE email = ?
      LIMIT 1
    `)
        .bind(email)
        .first<User>();

    if (!user) {
        return c.json(
            {
                error: "Email o contraseña incorrectos",
            },
            401,
        );
    }

    // 5. Comprobar la contraseña.
    const passwordValid = await verifyPassword(
        password,
        user.password_hash,
    );

    if (!passwordValid || user.is_active !== 1) {
        return c.json(
            {
                error: "Email o contraseña incorrectos",
            },
            401,
        );
    }

    // 6. Comprobar la configuración de firma.
    if (!c.env.JWT_SECRET || !c.env.JWT_REFRESH_SECRET) {
        throw new Error("Faltan los secretos JWT");
    }

    // 7. Crear la sesión y el par de tokens.
    const sessionId = crypto.randomUUID();
    const createdAt = nowSeconds();

    const { accessToken, refreshToken, refreshExpiresAt } =
        await createTokenPair(c, user.id, sessionId);

    // 8. Guardar únicamente el hash del refresh en D1.
    const refreshHash = await hashToken(refreshToken);

    await c.env.DB
        .prepare(`
            INSERT INTO auth_sessions (
                id,
                user_id,
                refresh_hash,
                created_at,
                expires_at
            )
            VALUES (?, ?, ?, ?, ?)
        `)
        .bind(
            sessionId,
            user.id,
            refreshHash,
            createdAt,
            refreshExpiresAt,
        )
        .run();

    // 9. Entregar los tokens en cookies y devolver solo datos públicos.
    setAuthCookies(c, accessToken, refreshToken);

    return c.json({
        message: "Sesión iniciada correctamente",
        data: {
            id: user.id,
            email: user.email,
        },
        expiresIn: ACCESS_TTL,
        refreshExpiresIn: REFRESH_TTL,
    });
});

authRoutes.post("/refresh", async (c) => {
    c.header("Cache-Control", "no-store");

    // 1. Comprobar el origen para evitar CSRF.
    const origin = c.req.header("Origin");

    if (!origin || origin !== c.env.APP_ORIGIN) {
        return c.json(
            {
                error: "Origen de la petición no permitido",
            },
            403,
        );
    }

    // 2. Comprobar la configuración de firma.
    if (!c.env.JWT_REFRESH_SECRET) {
        throw new Error("JWT_REFRESH_SECRET no está configurado");
    }

    // 3. Leer la cookie del refresh.
    const refreshToken = getCookie(c, "crm_refresh");

    if (!refreshToken) {
        clearAuthCookies(c);

        return c.json(
            {
                error: "La sesión ha caducado o no es válida",
            },
            401,
        );
    }

    // 4. Verificar la firma y las claims del refresh.
    let identity: TokenIdentity;

    try {
        identity = await verifyRefreshToken(
            refreshToken,
            c.env.JWT_REFRESH_SECRET,
        );
    } catch {
        clearAuthCookies(c);

        return c.json(
            {
                error: "La sesión ha caducado o no es válida",
            },
            401,
        );
    }

    // 5. Comprobar la sesión y el usuario en D1.
    // Queda fuera del catch del JWT: un fallo de D1 debe acabar en 500.
    const now = nowSeconds();

    const session = await c.env.DB
        .prepare(`
            SELECT s.refresh_hash
            FROM auth_sessions s
            INNER JOIN users u ON u.id = s.user_id
            WHERE s.id = ?
              AND s.user_id = ?
              AND s.revoked_at IS NULL
              AND s.expires_at > ?
              AND u.is_active = 1
            LIMIT 1
        `)
        .bind(identity.sessionId, identity.userId, now)
        .first<{ refresh_hash: string }>();

    if (!session) {
        clearAuthCookies(c);

        return c.json(
            {
                error: "La sesión ha caducado o no es válida",
            },
            401,
        );
    }

    // 6. Comprobar que el refresh recibido es el vigente.
    // Si no coincide, se revoca la sesión (detección de reutilización).
    const receivedHash = await hashToken(refreshToken);

    if (receivedHash !== session.refresh_hash) {
        await revokeSession(c.env.DB, identity.sessionId, identity.userId);

        clearAuthCookies(c);

        return c.json(
            {
                error: "La sesión ha caducado o no es válida",
            },
            401,
        );
    }

    // 7. Renovar el par de tokens.
    const {
        accessToken,
        refreshToken: newRefreshToken,
        refreshExpiresAt,
    } = await createTokenPair(c, identity.userId, identity.sessionId);

    const newRefreshHash = await hashToken(newRefreshToken);

    // 8. Reemplazar el hash de forma atómica: solo se renueva si el
    // refresh recibido sigue siendo el vigente y la sesión y el usuario
    // continúan activos.
    const updated = await c.env.DB
        .prepare(`
            UPDATE auth_sessions
            SET refresh_hash = ?,
                expires_at = ?
            WHERE id = ?
              AND user_id = ?
              AND refresh_hash = ?
              AND revoked_at IS NULL
              AND expires_at > ?
              AND EXISTS (
                  SELECT 1
                  FROM users
                  WHERE users.id = auth_sessions.user_id
                    AND users.is_active = 1
              )
            RETURNING id
        `)
        .bind(
            newRefreshHash,
            refreshExpiresAt,
            identity.sessionId,
            identity.userId,
            receivedHash,
            now,
        )
        .first<{ id: string }>();

    if (!updated) {
        // La sesión cambió entre la comprobación y la actualización:
        // se revoca para no dejar un refresh reutilizable.
        await revokeSession(c.env.DB, identity.sessionId, identity.userId);

        clearAuthCookies(c);

        return c.json(
            {
                error: "La sesión ha caducado o no es válida",
            },
            401,
        );
    }

    // 9. Entregar los tokens nuevos en cookies.
    setAuthCookies(c, accessToken, newRefreshToken);

    return c.json({
        message: "Tokens renovados correctamente",
        expiresIn: ACCESS_TTL,
        refreshExpiresIn: REFRESH_TTL,
    });
});

authRoutes.get("/me", authMiddleware, (c) => {
  const user = c.get("currentUser");

  return c.json({
    data: user,
  });
});

authRoutes.post("/logout", async (c) => {
  c.header("Cache-Control", "no-store");

  // Comprobar el origen también en el cierre de sesión.
  const origin = c.req.header("Origin");

  if (!origin || origin !== c.env.APP_ORIGIN) {
    return c.json(
      {
        error: "Origen de la petición no permitido",
      },
      403,
    );
  }

  // Un fallo de configuración no es un error del usuario.
  if (!c.env.JWT_REFRESH_SECRET) {
    throw new Error("JWT_REFRESH_SECRET no está configurado");
  }

  const refreshToken = getCookie(c, "crm_refresh");

  if (refreshToken) {
    let identity: TokenIdentity | null = null;

    try {
      // No se identifica ninguna sesión sin validar antes la firma.
      identity = await verifyRefreshToken(
        refreshToken,
        c.env.JWT_REFRESH_SECRET,
      );
    } catch {
      identity = null;
    }

    if (identity) {
      // Fuera del catch del JWT: un fallo de D1 debe acabar en 500.
      await revokeSession(c.env.DB, identity.sessionId, identity.userId);
    }
  }

  clearAuthCookies(c);

  return c.json({
    message: "Sesión cerrada correctamente",
  });
});




export default authRoutes;

