import { Type } from 'class-transformer';
import { IsNumber, ValidateNested } from 'class-validator';

import { User } from '@/models/user.model';
import { PaginatedResponse } from '@/types/common/pagination.type';

export class TotalUserCountResponse {
    @IsNumber()
    count!: number;
}

export class PaginatedUserResponse extends PaginatedResponse<User> {
    @ValidateNested({ each: true })
    @Type(() => User)
    docs!: Array<User>;
}
