import { FilterQuery } from 'mongoose';
import { Action, UnauthorizedError } from 'routing-controllers';
import { AuthorizationChecker } from 'routing-controllers/types/AuthorizationChecker';

import AdminModel from '@/models/admin.model';
import { BaseUser } from '@/models/common/base-user.model';
import UserModel from '@/models/user.model';
import { RoleType } from '@/types/auth.type';
import { JsonWebToken, Payload } from '@/utils/jwt.util';

export const authorizationChecker: AuthorizationChecker = async function authenticationMiddleware(
    action: Action,
    roles: RoleType[],
) {
    try {
        const token: string = action.request.headers['authorization'];

        // block request if token not passed
        if (!token) throw new UnauthorizedError('Unauthorized');

        const payload: Payload = JsonWebToken.verifyJwt(token.split('Bearer ')[1]);

        // block request if required role is missing
        if (roles?.length > 0 && !roles.includes(payload.role)) return false;

        const filter: FilterQuery<BaseUser> = { _id: payload._id };

        let user;

        switch (payload.role) {
            case RoleType.ADMIN:
                user = await AdminModel.findOne(filter);
                break;
            case RoleType.USER:
                user = await UserModel.findOne(filter);
                break;
        }

        action.request.user = user;
        return user !== null;
    } catch (error) {
        console.log(error);
        throw new UnauthorizedError('Unauthorized');
    }
};
