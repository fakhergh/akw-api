import { IsNumber, IsOptional, Max, Min } from 'class-validator';
import { QueryParam } from 'routing-controllers';

export class PaginationQueryParams {
    @Min(1)
    @IsOptional()
    @IsNumber()
    @QueryParam('page')
    page: number = 1;

    @Min(1)
    @Max(999)
    @IsOptional()
    @IsNumber()
    @QueryParam('limit')
    limit: number = 10;
}
