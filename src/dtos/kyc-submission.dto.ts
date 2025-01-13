import { Type } from 'class-transformer';
import { IsNumber, ValidateNested } from 'class-validator';
import { OpenAPIParam } from 'routing-controllers-openapi';

import { PaginatedResponse } from '@/dtos/common/pagination.dto';
import { KycSubmission } from '@/models/kyc-submission.model';
import { Gender } from '@/types/kyc-submission.type';

export class PaginatedKycSubmissionResponse extends PaginatedResponse<KycSubmission> {
    @ValidateNested({ each: true })
    @Type(() => KycSubmission)
    docs!: Array<KycSubmission>;
}

export class TotalKycSubmissionResponse {
    @IsNumber()
    count!: number;
}

export const CreateKycSubmissionOpenApiParams: OpenAPIParam = {
    requestBody: {
        required: true,
        content: {
            'multipart/form-data': {
                schema: {
                    type: 'object',
                    properties: {
                        firstName: {
                            type: 'string',
                        },
                        lastName: {
                            type: 'string',
                        },
                        email: {
                            type: 'string',
                        },
                        address: {
                            type: 'string',
                        },
                        phoneNumber: {
                            type: 'string',
                        },
                        gender: {
                            type: 'string',
                            enum: [Gender.MALE, Gender.FEMALE],
                        },
                        documents: {
                            type: 'array',
                            items: {
                                type: 'string',
                                format: 'binary',
                            },
                        },
                    },
                    required: [
                        'firstName',
                        'lastName',
                        'email',
                        'address',
                        'phoneNumber',
                        'gender',
                        'documents',
                    ],
                },
                encoding: {
                    documents: {
                        contentType: 'image/png, image/jpeg, image/jpg',
                    },
                },
            },
        },
    },
};

export class CreateKycSubmissionDto {
    firstName!: string;

    lastName!: string;

    email!: string;

    phoneNumber!: string;

    address!: string;

    gender!: Gender;

    uploads!: Express.Multer.File | Array<Express.Multer.File>;
}
