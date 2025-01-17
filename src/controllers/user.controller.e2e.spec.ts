import { StatusCodes } from 'http-status-codes';
import request from 'supertest';

import { app } from '@/app';
import { LoginDto, LoginResponse } from '@/dtos/auth.dto';

const adminLoginDto: LoginDto = {
    email: 'admin@gmail.com',
    password: '0000',
};

let accessToken!: string;

beforeAll(async () => {
    const loginResponse = await request(app).post('/auth/admin/login').send(adminLoginDto);

    accessToken = (loginResponse.body as LoginResponse).accessToken;
});

describe('UserController', () => {
    it('Should return 200 on /users', async () => {
        const usersResponse = await request(app)
            .get('/users')
            .set('authorization', `Bearer ${accessToken}`);

        expect(usersResponse.status).toBe(StatusCodes.OK);
        expect(usersResponse.body).toHaveProperty('docs');
        expect(Array.isArray(usersResponse.body.docs)).toBeTruthy();
    });

    it('Should return 200 on /users/count', async () => {
        const usersResponse = await request(app)
            .get('/users/count')
            .set('authorization', `Bearer ${accessToken}`);

        expect(usersResponse.status).toBe(StatusCodes.OK);
        expect(usersResponse.body).toHaveProperty('count');
        expect(typeof usersResponse.body.count).toBe('number');
    });
});
