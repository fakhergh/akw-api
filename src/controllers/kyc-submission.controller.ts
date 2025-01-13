import { Request } from 'express';
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
    Req,
} from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import { Container } from 'typedi';

import { PaginationQueryParams } from '@/dtos/common/pagination.dto';
import {
    CreateKycSubmissionDto,
    CreateKycSubmissionOpenApiParams,
    PaginatedKycSubmissionResponse,
    TotalKycSubmissionResponse,
} from '@/dtos/kyc-submission.dto';
import { ConflictError, UnprocessableEntityError } from '@/errors';
import { KycSubmission } from '@/models/kyc-submission.model';
import { User } from '@/models/user.model';
import { CreateKycSubmissionData, KycSubmissionService } from '@/services/kyc-submission.service';
import { UserService } from '@/services/user.service';
import { RoleType } from '@/types/auth.type';
import { KycSubmissionStatus } from '@/types/kyc-submission.type';
import { FilesUpload } from '@/utils/upload.util';

@JsonController('/kyc-submissions')
export class KycSubmissionController {
    private readonly kycSubmissionService: KycSubmissionService =
        Container.get(KycSubmissionService);
    private readonly userService: UserService = Container.get(UserService);

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

    @Get('/user/:userId')
    @Authorized([RoleType.ADMIN, RoleType.USER])
    @ResponseSchema(KycSubmission)
    async kycSubmissionByUser(@Param('userId') userId: string) {
        return this.kycSubmissionService.getSubmissionsByUserId(userId);
    }

    @Post()
    @Authorized(RoleType.USER)
    @OpenAPI(CreateKycSubmissionOpenApiParams)
    @ResponseSchema(KycSubmission)
    async createKycSubmission(
        @FilesUpload('documents') uploads: Express.Multer.File | Array<Express.Multer.File>,
        @CurrentUser() user: User,
        @Req() req: Request,
    ) {
        if (user.kycStatus === KycSubmissionStatus.PENDING)
            throw new ConflictError('KYC already submitted');

        if (user.kycStatus === KycSubmissionStatus.APPROVED)
            throw new ConflictError('KYC already approved');

        const body = req.body as CreateKycSubmissionDto;

        if (!uploads) throw new BadRequestError('KYC documents are required');

        const lastKycSubmission = await this.kycSubmissionService.getSubmissionsByUserId(user._id);

        if (lastKycSubmission?.status === KycSubmissionStatus.APPROVED)
            throw new ConflictError('User KYC is already approved');

        let documents: CreateKycSubmissionData['documents'] = [];

        if (Array.isArray(uploads)) {
            documents = uploads.map((upload) => ({
                path: upload.path,
                mimetype: upload.mimetype,
                size: upload.size,
                filename: upload.filename,
            }));
        } else {
            documents = [
                {
                    path: uploads.path,
                    mimetype: uploads.mimetype,
                    size: uploads.size,
                    filename: uploads.filename,
                },
            ];
        }

        const data: CreateKycSubmissionData = {
            userId: user._id,
            ...body,
            documents,
        };

        const kycSubmission = await this.kycSubmissionService.createSubmission(data);

        await this.userService.updateUserKycStatus(user._id, KycSubmissionStatus.PENDING);

        return kycSubmission;
    }

    @Put('/:id/approve')
    @Authorized(RoleType.ADMIN)
    @ResponseSchema(KycSubmission)
    async approveSubmission(@Param('id') id: string) {
        let submission = await this.kycSubmissionService.getLastSubmissionById(id);

        if (!submission) throw new NotFoundError('Submission not found');

        if (submission.status !== KycSubmissionStatus.PENDING)
            throw new UnprocessableEntityError('Submission already processed');

        submission = await this.kycSubmissionService.updateSubmissionStatus(
            id,
            KycSubmissionStatus.APPROVED,
        );

        await this.userService.updateUserKycStatus(
            submission?.userId.toString() as string,
            KycSubmissionStatus.APPROVED,
        );

        return submission;
    }

    @Put('/:id/reject')
    @Authorized(RoleType.ADMIN)
    @ResponseSchema(KycSubmission)
    async rejectSubmission(@Param('id') id: string) {
        let submission = await this.kycSubmissionService.getLastSubmissionById(id);

        if (!submission) throw new NotFoundError('Submission not found');

        if (submission.status !== KycSubmissionStatus.PENDING)
            throw new UnprocessableEntityError('Submission already processed');

        submission = await this.kycSubmissionService.updateSubmissionStatus(
            id,
            KycSubmissionStatus.REJECTED,
        );

        await this.userService.updateUserKycStatus(
            submission?.userId.toString() as string,
            KycSubmissionStatus.REJECTED,
        );

        return submission;
    }
}
