import { Type } from 'class-transformer';
import { IsNumber, ValidateNested } from 'class-validator';

import { PaginatedResponse } from '@/dtos/common/pagination.dto';
import { KycSubmission } from '@/models/kyc-submission.model';

export class PaginatedKycSubmissionResponse extends PaginatedResponse<KycSubmission> {
    @ValidateNested({ each: true })
    @Type(() => KycSubmission)
    docs!: Array<KycSubmission>;
}

export class TotalKycSubmissionResponse {
    @IsNumber()
    count!: number;
}
