import { JwtPayload, sign, verify } from 'jsonwebtoken';

import { Config } from '@/config';
import { RoleType } from '@/types/auth.type';

const accessTokenCredentials = Config.jwt.access;
const refreshTokenCredentials = Config.jwt.refresh;

export interface Payload extends JwtPayload {
    _id: string;
    role: RoleType;
}

export class JsonWebToken {
    static signJwt(payload: string | object): string {
        return sign(payload, accessTokenCredentials.secret, {
            expiresIn: accessTokenCredentials.expiresIn,
        });
    }

    static verifyJwt(token: string): Payload {
        return verify(token, accessTokenCredentials.secret) as Payload;
    }

    static signJwtRefresh(payload: string | object): string {
        return sign(payload, refreshTokenCredentials.secret, {
            expiresIn: refreshTokenCredentials.expiresIn,
        });
    }

    static verifyJwtRefresh(token: string): Payload {
        return verify(token, refreshTokenCredentials.secret) as Payload;
    }
}
