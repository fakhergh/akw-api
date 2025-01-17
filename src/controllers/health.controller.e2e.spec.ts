import { StatusCodes } from 'http-status-codes';
import request from 'supertest';

import { app } from '@/app';

describe('HealthController', () => {
    it('Should return 404 on /', async () => {
        const response = await request(app).get('/');
        expect(response.status).toBe(StatusCodes.NOT_FOUND);
    });
});
