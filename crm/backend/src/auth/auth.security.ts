import {compare, hash} from "bcryptjs";

const HASH_COST = 12;

export function passwordFitsBcrypt(password: string):boolean{
    const bytes = new TextEncoder().encode(password);
    return bytes.length <= 72;
}

export function hashPassword(password: string): Promise<string>{
    if(!passwordFitsBcrypt(password)){
        throw new Error("La contraseña supera los 72 bytes")
    }
    return hash(password, HASH_COST);
}

export async function verifyPassword(password: string, passwordHash: string): Promise<boolean> {
    if(!passwordFitsBcrypt(password)){
        return false;
    }
    return compare(password, passwordHash);
}