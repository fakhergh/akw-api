import { IsString } from 'class-validator';

export class BaseModel {
    @IsString()
    _id!: string;

    @IsString()
    createdAt?: Date;

    @IsString()
    updatedAt?: Date;
}
