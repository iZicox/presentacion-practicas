import { createMiddleware } from "hono/factory";
import { getCookie, deleteCookie } from "hono/cookie";
import { verify } from "hono/jwt";

import type { AppEnv } from "../types";

interface AuthUserRow {
  id: number;
  email: string;
  is_active: number; 
}

export const authMiddleware = createMiddleware<AppEnv>(
  async (c, next) => {
    c.header("Cache-Control", "no-store");

    const secure = c.env.COOKIE_SECURE === "true";

    const clearCookie = () => {
      deleteCookie(c, "crm_token", {
        path: "/",
        secure,
      });
    };

    // 1. Leer el token de la cookie.
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

    let userId: number;

    try {
      // 2. Verificar la firma con el algoritmo esperado.
      const payload = await verify(
        token,
        c.env.JWT_SECRET,
        "HS256",
      );

      const now = Math.floor(Date.now() / 1000);

      // 3. Exigir las claims utilizadas por nuestro login.
      if (
        typeof payload.sub !== "string" ||
        !/^[1-9]\d*$/.test(payload.sub) ||
        payload.iss !== "crm-backend" ||
        payload.aud !== "crm-api" ||
        typeof payload.iat !== "number" ||
        typeof payload.exp !== "number" ||
        !Number.isInteger(payload.iat) ||
        !Number.isInteger(payload.exp) ||
        payload.iat > now ||
        payload.exp <= now ||
        payload.exp <= payload.iat ||
        payload.exp - payload.iat > 300
      ) {
        throw new Error("Claims del token no válidas");
      }

      userId = Number(payload.sub);

      if (!Number.isSafeInteger(userId)) {
        throw new Error("Identificador no válido");
      }
    } catch {
      clearCookie();

      return c.json(
        {
          error: "La sesión ha caducado o no es válida",
        },
        401,
      );
    }

    // 4. Comprobar que el usuario existe y sigue activo.
    // Esta consulta queda fuera del catch del JWT:
    // un fallo de D1 no debe confundirse con un token inválido.
    const user = await c.env.DB
      .prepare(`
        SELECT id, email, is_active
        FROM users
        WHERE id = ?
        LIMIT 1
      `)
      .bind(userId)
      .first<AuthUserRow>();


    if (!user || user.is_active !== 1) {
      clearCookie();

      return c.json(
        {
          error: "La cuenta no está disponible",
        },
        401,
      );
    }

    // 5. Dejar el usuario disponible para la ruta.
    c.set("currentUser", {
      id: user.id,
      email: user.email,
    });

    // 6. Continuar con la ruta protegida.
    await next();
  },
);