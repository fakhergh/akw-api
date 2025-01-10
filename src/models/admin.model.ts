import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose';
import { compare } from 'bcryptjs';
import { IsString } from 'class-validator';

import { BaseUser } from '@/models/common/base-user.model';

@modelOptions({ schemaOptions: { collection: 'admins', timestamps: true } })
export class Admin extends BaseUser {
    @IsString()
    @prop({ required: true, unique: true })
    username!: string;
}

const AdminModel = getModelForClass(Admin);

const AdminSchema = AdminModel.schema;

AdminSchema.methods.isValidPassword = function (password: string) {
    return compare(password, this.password);
};

export default AdminModel as typeof AdminModel;
