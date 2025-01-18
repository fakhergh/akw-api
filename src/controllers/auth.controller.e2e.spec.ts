import { StatusCodes } from 'http-status-codes';
import request from 'supertest';

import { app } from '@/app';
import { LoginDto, UserRegisterDto } from '@/dtos/auth.dto';

let accessToken!: string;

const adminLoginDto: LoginDto = {
    email: 'admin@gmail.com',
    password: '0000',
};

const userRegisterDto: UserRegisterDto = {
    firstName: 'Joe',
    lastName: 'Hattab',
    email: 'joe.hattab@gmail.com',
    password: '0000',
};

const userLoginDto: LoginDto = {
    email: 'joe.hattab@gmail.com',
    password: '0000',
};

describe('AuthController', () => {
    it('Should return 401 on [GET] /auth/admin/me', async () => {
        const response = await request(app).get('/auth/admin/me');

        expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
    });

    it('Should return 200 on [POST] /auth/admin/login', async () => {
        const response = await request(app).post('/auth/admin/login').send(adminLoginDto);

        accessToken = response.body.accessToken;

        expect(response.status).toBe(StatusCodes.OK);
        expect(response.body).toHaveProperty('accessToken');
        expect(response.body).toHaveProperty('refreshToken');
    });

    it('Should return 200 on [GET] /auth/admin/me', async () => {
        const response = await request(app)
            .get('/auth/admin/me')
            .set('authorization', `Bearer ${accessToken}`);

        expect(response.status).toBe(StatusCodes.OK);
    });

    it('Should return 404 on [POST] /auth/admin/login', async () => {
        const response = await request(app)
            .post('/auth/admin/login')
            .send({ ...adminLoginDto, password: 'xxxx' });

        expect(response.status).toBe(StatusCodes.NOT_FOUND);
    });

    it('Should return 404 on [POST] /auth/admin/login', async () => {
        const response = await request(app)
            .post('/auth/admin/login')
            .send({ ...adminLoginDto, email: 'alex@gmail.com' });

        expect(response.status).toBe(StatusCodes.NOT_FOUND);
    });

    it('Should return 200 on [POST] /auth/user/register', async () => {
        const response = await request(app).post('/auth/user/register').send(userRegisterDto);

        expect(response.status).toBe(StatusCodes.CREATED);
        expect(response.body).toHaveProperty('accessToken');
        expect(response.body).toHaveProperty('refreshToken');
    });

    it('Should return 409 on [POST] /auth/user/register', async () => {
        const response = await request(app).post('/auth/user/register').send(userRegisterDto);

        expect(response.status).toBe(StatusCodes.CONFLICT);
    });

    it('Should return 200 on [POST] /auth/user/login', async () => {
        const response = await request(app).post('/auth/user/login').send(userLoginDto);

        expect(response.status).toBe(StatusCodes.OK);
        expect(response.body).toHaveProperty('accessToken');
        expect(response.body).toHaveProperty('refreshToken');
    });
});
