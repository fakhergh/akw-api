import { Type } from 'class-transformer';
import { IsNumber, ValidateNested } from 'class-validator';

import { PaginatedResponse } from '@/dtos/common/pagination.dto';
import { User } from '@/models/user.model';

export class TotalUserCountResponse {
    @IsNumber()
    count!: number;
}

export class PaginatedUserResponse extends PaginatedResponse<User> {
    @ValidateNested({ each: true })
    @Type(() => User)
    docs!: Array<User>;
}
