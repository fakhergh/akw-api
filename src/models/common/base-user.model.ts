import { prop } from '@typegoose/typegoose';
import { compare } from 'bcryptjs';
import { IsString } from 'class-validator';

import { BaseModel } from '@/models/common/base.model';

export class BaseUser extends BaseModel {
    @IsString()
    @prop({ lowercase: true, unique: true, sparse: true })
    email?: string;

    @prop()
    password?: string;

    isValidPassword(password: string) {
        return compare(password, this.password!);
    }
}
