import { IsBoolean, IsNumber, IsOptional } from 'class-validator';
import { PaginateResult } from 'mongoose';

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
