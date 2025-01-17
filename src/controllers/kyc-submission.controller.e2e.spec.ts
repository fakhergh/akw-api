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

describe('KycSubmissionController', () => {
    it('Should return 200 on /kyc-submissions', async () => {
        const submissionsResponse = await request(app)
            .get('/kyc-submissions')
            .set('authorization', `Bearer ${accessToken}`);

        expect(submissionsResponse.status).toBe(StatusCodes.OK);
        expect(submissionsResponse.body).toHaveProperty('docs');
        expect(Array.isArray(submissionsResponse.body.docs)).toBeTruthy();
    });

    it('Should return 200 on /kyc-submissions/count', async () => {
        const submissionsResponse = await request(app)
            .get('/kyc-submissions/count')
            .set('authorization', `Bearer ${accessToken}`);

        expect(submissionsResponse.status).toBe(StatusCodes.OK);
        expect(submissionsResponse.body).toHaveProperty('count');
        expect(typeof submissionsResponse.body.count).toBe('number');
    });

    it('Should return 200 on /kyc-submissions/count?status=pending', async () => {
        const submissionsResponse = await request(app)
            .get('/kyc-submissions/count?status=pending')
            .set('authorization', `Bearer ${accessToken}`);

        expect(submissionsResponse.status).toBe(StatusCodes.OK);
        expect(submissionsResponse.body).toHaveProperty('count');
        expect(typeof submissionsResponse.body.count).toBe('number');
    });
});
