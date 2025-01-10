import { FilterQuery } from 'mongoose';
import { Service } from 'typedi';

import UserModel, { User } from '@/models/user.model';

export interface CreateUserData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

@Service()
export class UserService {
    getUserById(id: string) {
        return UserModel.findById(id);
    }

    getUserByEmail(email: string) {
        const filter: FilterQuery<User> = { email };
        return UserModel.findOne(filter);
    }

    createUser(data: CreateUserData) {
        return UserModel.create(data);
    }
}
