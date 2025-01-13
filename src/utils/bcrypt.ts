import { compare, genSalt, hash } from 'bcryptjs';

export async function hashPassword(password: string) {
    const salt = await genSalt(10);
    return hash(password, salt); // Hash the password
}

export function comparePassword(password: string, hashed: string) {
    return compare(password, hashed);
}
