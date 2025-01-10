import { Get, JsonController, QueryParams } from 'routing-controllers';
import { ResponseSchema } from 'routing-controllers-openapi';
import { Container } from 'typedi';

import { PaginationQueryParams } from '@/dtos/common/pagination.dto';
import { UserService } from '@/services/user.service';
import { PaginatedUserResponse, TotalUserCountResponse } from '@/types/user.type';

@JsonController('/users')
export class UserController {
    private readonly userService: UserService = Container.get(UserService);

    @Get()
    @ResponseSchema(PaginatedUserResponse)
    async paginatedUsers(@QueryParams() { page, limit }: PaginationQueryParams) {
        return this.userService.getPaginatedUsers(page, limit);
    }

    @ResponseSchema(TotalUserCountResponse)
    @Get('/count')
    async usersCount() {
        const count = await this.userService.getTotalUsersCount();
        return { count };
    }
}
