import { Type } from 'class-transformer';
import { IsNumber, ValidateNested } from 'class-validator';

import { PaginatedResponse } from '@/dtos/common/pagination.dto';
import { KycSubmission } from '@/models/kyc-submission.model';
import { FileUpload } from '@/utils/upload.util';

export class PaginatedKycSubmissionResponse extends PaginatedResponse<KycSubmission> {
    @ValidateNested({ each: true })
    @Type(() => KycSubmission)
    docs!: Array<KycSubmission>;
}

export class TotalKycSubmissionResponse {
    @IsNumber()
    count!: number;
}

export class CreateKycSubmissionDto {
    @FileUpload('documents')
    uploads!: Express.Multer.File | Array<Express.Multer.File>;
}
