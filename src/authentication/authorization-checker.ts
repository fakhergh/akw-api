import { FilterQuery } from 'mongoose';
import { Action, UnauthorizedError } from 'routing-controllers';
import { AuthorizationChecker } from 'routing-controllers/types/AuthorizationChecker';

import AdminModel from '@/models/admin.model';
import { BaseUser } from '@/models/common/base-user.model';
import { RoleType } from '@/types/role.type';
import { JsonWebToken, Payload } from '@/utils/jwt.util';

export const authorizationChecker: AuthorizationChecker = async function authenticationMiddleware(
    action: Action,
) {
    try {
        const token: string = action.request.headers['authorization'];

        if (!token) return false;

        const payload: Payload = JsonWebToken.verifyJwt(token.split('Bearer ')[1]);

        const filter: FilterQuery<BaseUser> = { _id: payload._id };

        let user;

        switch (payload.role) {
            case RoleType.ADMIN:
                user = await AdminModel.findOne(filter);
                break;
            case RoleType.USER:
                user = await AdminModel.findOne(filter);
                break;
        }

        return user !== null;
    } catch (error) {
        console.log(error);
        throw new UnauthorizedError('Unauthorized');
    }
};
