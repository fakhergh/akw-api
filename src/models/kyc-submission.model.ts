import { getModelForClass, modelOptions, plugin, prop, Ref } from '@typegoose/typegoose';
import { Type } from 'class-transformer';
import { IsEnum, IsOptional, IsString, ValidateNested } from 'class-validator';
import { PaginateModel, Schema } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

import { Config } from '@/config';
import { BaseModel } from '@/models/common/base.model';
import { User } from '@/models/user.model';
import { KycSubmissionStatus } from '@/types/kyc-submission.type';

@modelOptions({
    schemaOptions: {
        _id: false,
        versionKey: false,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    },
})
class UserDocument {
    get url(): string {
        return `${Config.app.domain}${Config.upload.documents}/${this.path}`;
    }

    @prop({ required: true })
    path!: string;

    @prop({ required: true })
    mimetype!: string;

    @prop({ required: true })
    size!: number;
}

@plugin(mongoosePaginate)
@modelOptions({
    schemaOptions: {
        collection: Config.database.collections.kycSubmission,
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    },
})
export class KycSubmission extends BaseModel {
    @IsString()
    @prop({ required: true })
    userId!: Schema.Types.ObjectId;

    @IsOptional()
    @ValidateNested()
    @Type(() => User)
    @prop({
        ref: Config.database.collections.user,
        foreignField: '_id',
        localField: 'userId',
        justOne: true,
    })
    user!: Ref<User>;

    @IsEnum(KycSubmissionStatus)
    @prop({ enum: KycSubmissionStatus, default: KycSubmissionStatus.PENDING })
    status!: KycSubmissionStatus;

    @prop({ required: true, type: UserDocument })
    documents!: Array<UserDocument>;
}

const KycSubmissionModel = getModelForClass(KycSubmission);

export default KycSubmissionModel as typeof KycSubmissionModel &
    PaginateModel<typeof KycSubmission>;
