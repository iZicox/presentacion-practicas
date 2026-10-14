
export interface CloudflareBindings {
    DB: D1Database;
    REGISTRATION_KEY: string;
    APP_ORIGIN: string;
    JWT_SECRET: string;
    COOKIE_SECURE: string;
}

export interface User {
    id: number;
    email: string;
    password_hash: string;
    is_active: number;
    created_at: string;
}

export interface AppEnv {
    Bindings: CloudflareBindings;
}