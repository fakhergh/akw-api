import { getModelForClass, modelOptions, plugin, prop } from '@typegoose/typegoose';
import { IsString } from 'class-validator';
import { PaginateModel } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

import { BaseUser } from '@/models/common/base-user.model';

@plugin(mongoosePaginate)
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

export default UserModel as typeof UserModel & PaginateModel<typeof User>;
