import { FilterQuery, PaginateOptions, Types } from 'mongoose';
import { Service } from 'typedi';

import UserModel, { User } from '@/models/user.model';
import { KycSubmissionStatus } from '@/types/kyc-submission.type';

export interface CreateUserData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

@Service()
export class UserService {
    getUserById(id: Types.ObjectId | string) {
        return UserModel.findById(id);
    }

    getUserByEmail(email: string) {
        const filter: FilterQuery<User> = { email };
        return UserModel.findOne(filter);
    }

    createUser(data: CreateUserData) {
        return UserModel.create(data);
    }

    getPaginatedUsers(page = 1, limit = 10) {
        const filter = {};
        const paginateOptions: PaginateOptions = { page, limit, sort: { createdAt: -1 } };

        return UserModel.paginate(filter, paginateOptions);
    }

    getTotalUsersCount() {
        return UserModel.countDocuments();
    }

    updateUserKycStatus(id: Types.ObjectId | string, kycStatus: KycSubmissionStatus) {
        const filter = { _id: id };
        const update = { $set: { kycStatus } };
        const options = { new: true };
        return UserModel.findOneAndUpdate(filter, update, options);
    }
}
