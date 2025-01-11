import { Authorized, Get, JsonController, QueryParams } from 'routing-controllers';
import { ResponseSchema } from 'routing-controllers-openapi';
import { Container } from 'typedi';

import { PaginationQueryParams } from '@/dtos/common/pagination.dto';
import { PaginatedUserResponse, TotalUserCountResponse } from '@/dtos/user.dto';
import { UserService } from '@/services/user.service';
import { RoleType } from '@/types/auth.type';

@JsonController('/users')
export class UserController {
    private readonly userService: UserService = Container.get(UserService);

    @Get()
    @Authorized(RoleType.ADMIN)
    @ResponseSchema(PaginatedUserResponse)
    async paginatedUsers(@QueryParams() { page, limit }: PaginationQueryParams) {
        return this.userService.getPaginatedUsers(page, limit);
    }

    @Get('/count')
    @Authorized(RoleType.ADMIN)
    @ResponseSchema(TotalUserCountResponse)
    async usersCount() {
        const count = await this.userService.getTotalUsersCount();
        return { count };
    }
}
