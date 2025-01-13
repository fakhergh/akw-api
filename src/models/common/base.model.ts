import { IsString } from 'class-validator';
import { Document } from 'mongoose';

export class BaseModel extends Document {
    @IsString()
    _id!: string;

    @IsString()
    createdAt?: Date;

    @IsString()
    updatedAt?: Date;
}
