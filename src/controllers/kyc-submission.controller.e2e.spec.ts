import { StatusCodes } from 'http-status-codes';
import request from 'supertest';

import { app } from '@/app';
import { LoginDto, LoginResponse, UserRegisterDto } from '@/dtos/auth.dto';
import { CreateKycSubmissionDto } from '@/dtos/kyc-submission.dto';
import { Gender } from '@/types/kyc-submission.type';

let adminAccessToken!: string;
let userAccessToken!: string;
let submissionId!: string;

const adminLoginDto: LoginDto = {
    email: 'admin@gmail.com',
    password: '0000',
};

const userRegisterDto: UserRegisterDto = {
    firstName: 'Joe',
    lastName: 'Hattab',
    email: 'joe.hattab10@gmail.com',
    password: '0000',
};

const createKycSubmissionDto: CreateKycSubmissionDto = {
    firstName: 'joe',
    lastName: 'hattab',
    email: 'joe.hattab10@gmail.com',
    address: 'Tecom, Dubai',
    phoneNumber: '+971527098568',
    gender: Gender.MALE,
};

beforeAll(async () => {
    const adminLoginResponse = await request(app).post('/auth/admin/login').send(adminLoginDto);

    adminAccessToken = (adminLoginResponse.body as LoginResponse).accessToken;

    const userRegisterResponse = await request(app)
        .post('/auth/user/register')
        .send(userRegisterDto);

    userAccessToken = (userRegisterResponse.body as LoginResponse).accessToken;
});

describe('KycSubmissionController', () => {
    it('Should return 200 on [GET] /kyc-submissions', async () => {
        const submissionsResponse = await request(app)
            .get('/kyc-submissions')
            .set('authorization', `Bearer ${adminAccessToken}`);

        expect(submissionsResponse.status).toBe(StatusCodes.OK);
        expect(submissionsResponse.body).toHaveProperty('docs');
        expect(Array.isArray(submissionsResponse.body.docs)).toBeTruthy();
    });

    it('Should return 200 on [GET] /kyc-submissions/count', async () => {
        const submissionsResponse = await request(app)
            .get('/kyc-submissions/count')
            .set('authorization', `Bearer ${adminAccessToken}`);

        expect(submissionsResponse.status).toBe(StatusCodes.OK);
        expect(submissionsResponse.body).toHaveProperty('count');
        expect(typeof submissionsResponse.body.count).toBe('number');
    });

    it('Should return 200 on [GET] /kyc-submissions/count?status=pending', async () => {
        const submissionsResponse = await request(app)
            .get('/kyc-submissions/count?status=pending')
            .set('authorization', `Bearer ${adminAccessToken}`);

        expect(submissionsResponse.status).toBe(StatusCodes.OK);
        expect(submissionsResponse.body).toHaveProperty('count');
        expect(typeof submissionsResponse.body.count).toBe('number');
    });

    it('Should return 201 on [POST] /kyc-submissions', async () => {
        const submissionsResponse = await request(app)
            .post('/kyc-submissions')
            .field('firstName', createKycSubmissionDto.firstName)
            .field('lastName', createKycSubmissionDto.lastName)
            .field('email', createKycSubmissionDto.email)
            .field('address', createKycSubmissionDto.address)
            .field('phoneNumber', createKycSubmissionDto.phoneNumber)
            .field('gender', createKycSubmissionDto.gender)
            .attach('documents', './__tests__/test-document.png')
            .set('authorization', `Bearer ${userAccessToken}`);

        submissionId = submissionsResponse.body._id;
        expect(submissionsResponse.status).toBe(StatusCodes.CREATED);
    });

    it('Should return 200 on [PUT] /kyc-submissions/:id/reject', async () => {
        const rejectSubmissionResponse = await request(app)
            .put(`/kyc-submissions/${submissionId}/reject`)
            .set('authorization', `Bearer ${adminAccessToken}`);

        expect(rejectSubmissionResponse.status).toBe(StatusCodes.OK);
    });

    it('Should return 200 on [PUT] /kyc-submissions/:id/approve', async () => {
        const submissionResponse = await request(app)
            .post('/kyc-submissions')
            .field('firstName', createKycSubmissionDto.firstName)
            .field('lastName', createKycSubmissionDto.lastName)
            .field('email', createKycSubmissionDto.email)
            .field('address', createKycSubmissionDto.address)
            .field('phoneNumber', createKycSubmissionDto.phoneNumber)
            .field('gender', createKycSubmissionDto.gender)
            .attach('documents', './__tests__/test-document.png')
            .set('authorization', `Bearer ${userAccessToken}`);

        submissionId = submissionResponse.body._id;

        const approveSubmissionResponse = await request(app)
            .put(`/kyc-submissions/${submissionId}/approve`)
            .set('authorization', `Bearer ${adminAccessToken}`);

        expect(approveSubmissionResponse.status).toBe(StatusCodes.OK);
    });

    it('Should return 422 on [PUT] /kyc-submissions/:id/approve', async () => {
        const approveSubmissionResponse = await request(app)
            .put(`/kyc-submissions/${submissionId}/approve`)
            .set('authorization', `Bearer ${adminAccessToken}`);

        expect(approveSubmissionResponse.status).toBe(StatusCodes.UNPROCESSABLE_ENTITY);
    });
});
