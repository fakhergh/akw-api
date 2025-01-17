import { StatusCodes } from 'http-status-codes';
import request from 'supertest';

import { app } from '@/app';

describe('App', () => {
    it('Should return 200 on /health', async () => {
        const response = await request(app).get('/health');
        expect(response.status).toBe(StatusCodes.OK);
    });
});
