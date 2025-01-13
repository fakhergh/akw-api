import { getModelForClass, modelOptions, plugin, prop, Ref } from '@typegoose/typegoose';
import { Exclude, Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Document as MongoDocument, PaginateModel, Schema } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

import { Config } from '@/config';
import { BaseModel } from '@/models/common/base.model';
import { User } from '@/models/user.model';
import { Gender, KycSubmissionStatus } from '@/types/kyc-submission.type';

@modelOptions({
    schemaOptions: {
        _id: false,
        versionKey: false,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    },
})
class UserDocument extends MongoDocument {
    @IsString()
    get url(): string {
        return `${Config.app.domain}${Config.upload.documents.endpoint}/${this.filename}`;
    }

    @Exclude()
    @prop({ required: true })
    path!: string;

    @IsString()
    @prop({ required: true })
    mimetype!: string;

    @IsNumber()
    @prop({ required: true })
    size!: number;

    @prop({ required: true })
    filename!: string;

    toJSON() {
        const obj = this.toObject();
        delete obj.filename;
        delete obj.path;
        return obj;
    }
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
    firstName!: string;

    @IsString()
    @prop({ required: true })
    lastName!: string;

    @IsString()
    @prop({ required: true, lowercase: true })
    email!: string;

    @IsString()
    @prop({ required: true })
    phoneNumber!: string;

    @IsString()
    @prop({ required: true })
    address!: string;

    @IsEnum(Gender)
    @prop({ enum: Gender, required: true })
    gender!: Gender;

    @IsString()
    @prop({ required: true })
    userId!: Schema.Types.ObjectId;

    @IsOptional()
    @ValidateNested()
    @Type(() => User)
    @prop({
        ref: 'User',
        foreignField: '_id',
        localField: 'userId',
        justOne: true,
    })
    user!: Ref<User>;

    @IsEnum(KycSubmissionStatus)
    @prop({ enum: KycSubmissionStatus, default: KycSubmissionStatus.PENDING, index: true })
    status!: KycSubmissionStatus;

    @ValidateNested({ each: true })
    @Type(() => UserDocument)
    @prop({ required: true, type: UserDocument })
    documents!: Array<UserDocument>;
}

const KycSubmissionModel = getModelForClass(KycSubmission);

export default KycSubmissionModel as typeof KycSubmissionModel &
    PaginateModel<typeof KycSubmission>;
