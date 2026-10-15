import { Hono } from "hono";
import { z } from "zod";
import { sign } from "hono/jwt";
import { setCookie, deleteCookie } from "hono/cookie";

import { authMiddleware } from "./auth.middleware";
import type { AppEnv, User } from "../types";
import {
    hashPassword,
    passwordFitsBcrypt,
    verifyPassword
} from "./auth.security";

const authRoutes = new Hono<AppEnv>();

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
    if (!c.env.JWT_SECRET) {
        throw new Error("JWT_SECRET no está configurado");
    }

    // 7. Crear un token válido durante cinco minutos.
    const now = Math.floor(Date.now() / 1000);
    const duration = 5 * 60;

    const token = await sign(
        {
            sub: String(user.id),
            iss: "crm-backend",
            aud: "crm-api",
            iat: now,
            exp: now + duration,
        },
        c.env.JWT_SECRET,
        "HS256",
    );

    // 8. Guardar el JWT en una cookie del cliente.
    const secure = c.env.COOKIE_SECURE === "true";

    setCookie(c, "crm_token", token, {
        httpOnly: true,
        secure,
        sameSite: "Strict",
        path: "/",
        maxAge: duration,
    });

    // 9. Devolver únicamente datos públicos.
    return c.json({
        message: "Sesión iniciada correctamente",
        data: {
            id: user.id,
            email: user.email,
        },
        expiresIn: duration,
    });
});

authRoutes.get("/me", authMiddleware, (c) => {
  const user = c.get("currentUser");

  return c.json({
    data: user,
  });
});

authRoutes.post("/logout", (c) => {
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

  const secure = c.env.COOKIE_SECURE === "true";

  deleteCookie(c, "crm_token", {
    path: "/",
    secure,
  });

  return c.json({
    message: "Sesión cerrada correctamente",
  });
});




export default authRoutes;

