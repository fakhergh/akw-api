import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose';
import { compare } from 'bcryptjs';
import { IsString } from 'class-validator';
import { PaginateModel } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

import { BaseUser } from '@/models/common/base-user.model';

@modelOptions({ schemaOptions: { collection: 'users', timestamps: true } })
export class User extends BaseUser {
    @IsString()
    @prop({ required: true })
    firstName!: string;

    @IsString()
    @prop({ required: true })
    lastName!: string;
}

const UserModel = getModelForClass(User);

const UserSchema = UserModel.schema;

UserSchema.plugin(mongoosePaginate);

UserSchema.methods.isValidPassword = function (password: string) {
    return compare(password, this.password);
};

export default UserModel as typeof UserModel & PaginateModel<typeof User>;
