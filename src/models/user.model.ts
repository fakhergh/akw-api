import { getModelForClass, modelOptions, plugin, prop } from '@typegoose/typegoose';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginateModel } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

import { Config } from '@/config';
import { BaseUser } from '@/models/common/base-user.model';
import { KycSubmissionStatus } from '@/types/kyc-submission.type';

@plugin(mongoosePaginate)
@modelOptions({
    schemaOptions: {
        collection: Config.database.collections.user,
        timestamps: true,
    },
})
export class User extends BaseUser {
    @IsString()
    @prop({ required: true })
    firstName!: string;

    @IsString()
    @prop({ required: true })
    lastName!: string;

    @IsOptional()
    @IsEnum(KycSubmissionStatus)
    @prop({ enum: KycSubmissionStatus })
    kycStatus!: KycSubmissionStatus;
}

const UserModel = getModelForClass(User);

export default UserModel as typeof UserModel & PaginateModel<typeof User>;
