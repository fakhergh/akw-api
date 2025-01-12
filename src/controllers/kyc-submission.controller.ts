import { StatusCodes } from 'http-status-codes';
import {
    Authorized,
    BadRequestError,
    CurrentUser,
    Get,
    HttpCode,
    JsonController,
    NotFoundError,
    Param,
    Post,
    Put,
    QueryParam,
    QueryParams,
} from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import { Container } from 'typedi';

import { PaginationQueryParams } from '@/dtos/common/pagination.dto';
import {
    PaginatedKycSubmissionResponse,
    TotalKycSubmissionResponse,
} from '@/dtos/kyc-submission.dto';
import { ConflictError, UnprocessableEntityError } from '@/errors';
import { KycSubmission } from '@/models/kyc-submission.model';
import { User } from '@/models/user.model';
import { CreateKycSubmissionData, KycSubmissionService } from '@/services/kyc-submission.service';
import { RoleType } from '@/types/auth.type';
import { KycSubmissionStatus } from '@/types/kyc-submission.type';
import { FilesUpload } from '@/utils/upload.util';

@JsonController('/kyc-submissions')
export class KycSubmissionController {
    private readonly kycSubmissionService: KycSubmissionService =
        Container.get(KycSubmissionService);

    @Get()
    @HttpCode(StatusCodes.OK)
    @Authorized(RoleType.ADMIN)
    @ResponseSchema(PaginatedKycSubmissionResponse)
    paginatedKycSubmissions(@QueryParams() { page, limit }: PaginationQueryParams) {
        return this.kycSubmissionService.getPaginatedKycSubmissions(page, limit);
    }

    @Get('/count')
    @Authorized(RoleType.ADMIN)
    @ResponseSchema(TotalKycSubmissionResponse)
    async kycSubmissionCount(@QueryParam('status') status: KycSubmissionStatus) {
        const count = await this.kycSubmissionService.getTotalKycSubmissionsCountByStatus(status);
        return { count };
    }

    @Get('/last')
    @Authorized([RoleType.ADMIN, RoleType.USER])
    @ResponseSchema(KycSubmission)
    async lastKycSubmission(@CurrentUser() user: User) {
        return this.kycSubmissionService.getLastSubmissionByUserId(user._id);
    }

    @Post()
    @Authorized(RoleType.USER)
    @OpenAPI({
        requestBody: {
            required: true,
            content: {
                'multipart/form-data': {
                    schema: {
                        type: 'object',
                        properties: {
                            documents: {
                                type: 'array',
                                items: {
                                    type: 'string',
                                    format: 'binary',
                                },
                                description: 'The documents to upload',
                            },
                        },
                    },
                },
            },
        },
    })
    @ResponseSchema(KycSubmission)
    async createKycSubmission(
        @FilesUpload('documents')
        uploads: Express.Multer.File | Array<Express.Multer.File>,
        @CurrentUser() user: User,
    ) {
        if (!uploads) throw new BadRequestError('KYC documents are required');

        const lastKycSubmission = await this.kycSubmissionService.getLastSubmissionByUserId(
            user._id,
        );

        if (lastKycSubmission?.status === KycSubmissionStatus.APPROVED)
            throw new ConflictError('User KYC is already approved');

        let documents: CreateKycSubmissionData['documents'] = [];

        if (Array.isArray(uploads)) {
            documents = uploads.map((upload) => ({
                path: upload.path,
                mimetype: upload.mimetype,
                size: upload.size,
            }));
        } else {
            documents = [{ path: uploads.path, mimetype: uploads.mimetype, size: uploads.size }];
        }

        const data: CreateKycSubmissionData = {
            userId: user._id,
            documents,
        };

        return this.kycSubmissionService.createSubmission(data);
    }

    @Put('/:id/approve')
    @Authorized(RoleType.ADMIN)
    @ResponseSchema(KycSubmission)
    async approveSubmission(@Param('id') id: string) {
        const submission = await this.kycSubmissionService.getLastSubmissionByUserId(id);

        if (!submission) throw new NotFoundError('Submission not found');

        if (submission.status !== KycSubmissionStatus.PENDING)
            throw new UnprocessableEntityError('Submission already processed');

        return this.kycSubmissionService.updateSubmissionStatus(id, KycSubmissionStatus.APPROVED);
    }

    @Put('/:id/reject')
    @Authorized(RoleType.ADMIN)
    @ResponseSchema(KycSubmission)
    async rejectSubmission(@Param('id') id: string) {
        const submission = await this.kycSubmissionService.getLastSubmissionByUserId(id);

        if (!submission) throw new NotFoundError('Submission not found');

        if (submission.status !== KycSubmissionStatus.PENDING)
            throw new UnprocessableEntityError('Submission already processed');

        return this.kycSubmissionService.updateSubmissionStatus(id, KycSubmissionStatus.APPROVED);
    }
}
