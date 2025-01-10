import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose';
import { IsString } from 'class-validator';

import { BaseUser } from '@/models/common/base-user.model';

@modelOptions({ schemaOptions: { collection: 'admins', timestamps: true } })
export class Admin extends BaseUser {
    @IsString()
    @prop({ required: true, unique: true })
    username!: string;
}

const AdminModel = getModelForClass(Admin);

export default AdminModel as typeof AdminModel;
