import { Hono } from "hono";
import { z } from "zod";

import type { AppEnv } from "../types";
import {
  hashPassword,
  passwordFitsBcrypt,
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

authRoutes.post("/register", async (c) =>{
    // comprobar que el registro esta habilitado
    if(!c.env.REGISTRATION_KEY){
        return c.json(
            {
                error: "El registro de usuarios está deshabilitado"
            },
            403
        );
    }

    // comprobar la clave de alta
    const registrationKey = c.req.header("X-Registration-Key");

    if(registrationKey !== c.env.REGISTRATION_KEY){
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

    if(contentType !== "application/json") {
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

    if(!validation.success){
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


    const {email, password} = validation.data;

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

        if(result.meta.changes === 0){
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

export default authRoutes;

