import { pre, prop } from '@typegoose/typegoose';
import { IsString } from 'class-validator';

import { BaseModel } from '@/models/common/base.model';
import { comparePassword, hashPassword } from '@/utils/bcrypt';

@pre<BaseUser>('save', async function () {
    if (this.isModified('password') && this.password) {
        this.password = await hashPassword(this.password);
    }
})
export class BaseUser extends BaseModel {
    @IsString()
    @prop({ lowercase: true, unique: true, sparse: true, index: true })
    email?: string;

    @prop()
    password?: string;

    isValidPassword(password: string) {
        return comparePassword(password, this.password!);
    }

    toJSON() {
        const obj = this.toObject();
        delete obj.password;
        return obj;
    }
}
