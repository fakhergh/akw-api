import { prop } from '@typegoose/typegoose';
import { IsString } from 'class-validator';

import { BaseModel } from '@/models/common/base.model';

export class BaseUser extends BaseModel {
    @IsString()
    @prop({ lowercase: true, unique: true, sparse: true })
    email?: string;

    @prop()
    password?: string;

    @prop({ default: false })
    deleted?: boolean;

    isValidPassword!: (password: string) => Promise<boolean>;
}
