import type { Context } from "hono";
import { sign, verify } from "hono/jwt";
import { setCookie, deleteCookie } from "hono/cookie";

import type { AppEnv } from "../types";

export const ACCESS_TTL = 300; // cinco minutos, en segundos
export const REFRESH_TTL = 604800; // siete días, en segundos

export interface TokenIdentity {
  userId: number;
  sessionId: string;
}

export function nowSeconds(): number {
  return Math.floor(Date.now() / 1000);
}

export async function hashToken(token: string): Promise<string> {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(token),
  );

  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export async function createTokenPair(
  c: Context<AppEnv>,
  userId: number,
  sessionId: string,
) {
  if (!c.env.JWT_SECRET || !c.env.JWT_REFRESH_SECRET) {
    throw new Error("Faltan secretos JWT");
  }

  const now = nowSeconds();

  const accessToken = await sign(
    {
      sub: String(userId),
      sid: sessionId,
      iss: "crm-backend",
      aud: "crm-api",
      iat: now,
      exp: now + ACCESS_TTL,
      jti: crypto.randomUUID(),
    },
    c.env.JWT_SECRET,
    "HS256",
  );

  const refreshToken = await sign(
    {
      sub: String(userId),
      sid: sessionId,
      iss: "crm-backend",
      aud: "crm-refresh",
      iat: now,
      exp: now + REFRESH_TTL,
      jti: crypto.randomUUID(),
    },
    c.env.JWT_REFRESH_SECRET,
    "HS256",
  );

  return {
    accessToken,
    refreshToken,
    refreshExpiresAt: now + REFRESH_TTL,
  };
}

async function verifyTypedToken(
  token: string,
  secret: string,
  audience: string,
  expectedDuration: number,
): Promise<TokenIdentity> {
  const payload = await verify(token, secret, "HS256");
  const now = nowSeconds();

  if (
    payload.iss !== "crm-backend" ||
    payload.aud !== audience ||
    typeof payload.sub !== "string" ||
    !/^[1-9]\d*$/.test(payload.sub) ||
    typeof payload.sid !== "string" ||
    payload.sid.length === 0 ||
    typeof payload.jti !== "string" ||
    payload.jti.length === 0 ||
    typeof payload.iat !== "number" ||
    typeof payload.exp !== "number" ||
    !Number.isInteger(payload.iat) ||
    !Number.isInteger(payload.exp) ||
    payload.iat > now ||
    payload.exp <= now ||
    payload.exp - payload.iat !== expectedDuration
  ) {
    throw new Error("Token inválido");
  }

  const userId = Number(payload.sub);

  if (!Number.isSafeInteger(userId)) {
    throw new Error("Identificador de usuario inválido");
  }

  return {
    userId,
    sessionId: payload.sid,
  };
}

export function verifyAccessToken(
  token: string,
  secret: string,
): Promise<TokenIdentity> {
  return verifyTypedToken(
    token,
    secret,
    "crm-api",
    ACCESS_TTL,
  );
}

export function verifyRefreshToken(
  token: string,
  secret: string,
): Promise<TokenIdentity> {
  return verifyTypedToken(
    token,
    secret,
    "crm-refresh",
    REFRESH_TTL,
  );
}

export function setAuthCookies(
  c: Context<AppEnv>,
  accessToken: string,
  refreshToken: string,
) {
  const secure = c.env.COOKIE_SECURE === "true";

  setCookie(c, "crm_token", accessToken, {
    httpOnly: true,
    secure,
    sameSite: "Strict",
    path: "/",
    maxAge: ACCESS_TTL,
  });

  setCookie(c, "crm_refresh", refreshToken, {
    httpOnly: true,
    secure,
    sameSite: "Strict",
    path: "/api/auth",
    maxAge: REFRESH_TTL,
  });
}

export function clearAuthCookies(c: Context<AppEnv>) {
  const secure = c.env.COOKIE_SECURE === "true";

  deleteCookie(c, "crm_token", {
    path: "/",
    secure,
  });

  deleteCookie(c, "crm_refresh", {
    path: "/api/auth",
    secure,
  });
}