import { JsonWebToken } from '@/utils/jwt.util';

const payload = { userId: 1, username: 'David' };

describe('JsonWebToken', () => {
    let token!: string;

    it('Should generate token', () => {
        token = JsonWebToken.signJwt(payload);
        expect(typeof token).toBe('string');
    });

    it('Should decode token', () => {
        const decodedPayload = JsonWebToken.verifyJwt(token);
        expect(decodedPayload).toMatchObject(payload);
    });
});
