import { createMiddleware } from "hono/factory";
import { getCookie, deleteCookie } from "hono/cookie";

import { verifyAccessToken, nowSeconds } from "./auth.tokens";
import type { TokenIdentity } from "./auth.tokens";
import type { AppEnv } from "../types";

interface AuthUserRow {
  id: number;
  email: string;
}

export const authMiddleware = createMiddleware<AppEnv>(
  async (c, next) => {
    c.header("Cache-Control", "no-store");

    const secure = c.env.COOKIE_SECURE === "true";

    // Solo se elimina la cookie del access token.
    // La cookie del refresh se conserva para poder renovar la sesión.
    const clearAccessCookie = () => {
      deleteCookie(c, "crm_token", {
        path: "/",
        secure,
      });
    };

    // 1. Leer el access token de la cookie.
    const token = getCookie(c, "crm_token");

    if (!token) {
      return c.json(
        {
          error: "Debes iniciar sesión",
        },
        401,
      );
    }

    // Un fallo de configuración no es un error del usuario.
    if (!c.env.JWT_SECRET) {
      throw new Error("JWT_SECRET no está configurado");
    }

    let identity: TokenIdentity;

    try {
      // 2. Verificar firma, emisor, audiencia y caducidad.
      identity = await verifyAccessToken(token, c.env.JWT_SECRET);
    } catch {
      clearAccessCookie();

      return c.json(
        {
          error: "La sesión ha caducado o no es válida",
        },
        401,
      );
    }

    // 3. Comprobar que el usuario y su sesión siguen activos.
    // Esta consulta queda fuera del catch del JWT:
    // un fallo de D1 debe acabar en el manejador global, no convertirse en 401.
    const user = await c.env.DB
      .prepare(`
        SELECT u.id, u.email
        FROM users u
        INNER JOIN auth_sessions s ON s.user_id = u.id
        WHERE u.id = ?
          AND u.is_active = 1
          AND s.id = ?
          AND s.revoked_at IS NULL
          AND s.expires_at > ?
        LIMIT 1
      `)
      .bind(identity.userId, identity.sessionId, nowSeconds())
      .first<AuthUserRow>();

    if (!user) {
      clearAccessCookie();

      return c.json(
        {
          error: "La sesión ha caducado o no es válida",
        },
        401,
      );
    }

    // 4. Dejar la identidad disponible para la ruta.
    c.set("currentUser", {
      id: user.id,
      email: user.email,
    });

    c.set("sessionId", identity.sessionId);

    // 5. Continuar con la ruta protegida.
    await next();
  },
);
