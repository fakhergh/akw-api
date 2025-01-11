import { IsBoolean, IsNumber, IsOptional, Max, Min } from 'class-validator';
import { PaginateResult } from 'mongoose';
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

export class PaginatedResponse<T> implements Omit<PaginateResult<T>, 'docs' | 'meta'> {
    @IsNumber()
    limit!: number;

    @IsOptional()
    @IsNumber()
    page?: number | undefined;

    @IsNumber()
    totalDocs!: number;

    @IsBoolean()
    hasPrevPage!: boolean;

    @IsBoolean()
    hasNextPage!: boolean;

    @IsNumber()
    totalPages!: number;

    @IsNumber()
    offset!: number;

    @IsOptional()
    @IsNumber()
    prevPage?: number | null | undefined;

    @IsOptional()
    @IsNumber()
    nextPage?: number | null | undefined;

    @IsNumber()
    pagingCounter!: number;

    [customLabel: string]: number | boolean | any[] | null | undefined;
}
