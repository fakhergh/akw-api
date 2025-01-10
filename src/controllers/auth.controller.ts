import {
    Body,
    HeaderParam,
    JsonController,
    NotFoundError,
    Post,
    UnauthorizedError,
} from 'routing-controllers';
import { ResponseSchema } from 'routing-controllers-openapi';
import { Container } from 'typedi';

import { LoginDto, UserRegisterDto } from '@/dtos/auth.dto';
import { ConflictError } from '@/errors';
import { AdminService } from '@/services/admin.service';
import { UserService } from '@/services/user.service';
import { LoginResponse, RefreshTokenResponse, UserRegisterResponse } from '@/types/auth.type';
import { RoleType } from '@/types/role.type';
import { JsonWebToken, Payload } from '@/utils/jwt.util';

@JsonController('/auth')
export class AuthController {
    private readonly adminService: AdminService = Container.get(AdminService);
    private readonly userService: UserService = Container.get(UserService);

    // Admin services

    @ResponseSchema(LoginResponse)
    @Post('/admin/login')
    async adminLogin(@Body() data: LoginDto) {
        const { email, password } = data;
        const admin = await this.adminService.getAdminByEmail(email);

        if (!admin) throw new NotFoundError('Admin not found');

        const isValidPassword = await admin.isValidPassword(password);

        if (!isValidPassword) throw new NotFoundError('Admin not found');

        const payload: Payload = { _id: admin._id.toString(), role: RoleType.ADMIN };

        const accessToken = JsonWebToken.signJwt(payload);

        const refreshToken = JsonWebToken.signJwtRefresh(payload);

        return { accessToken, refreshToken };
    }

    @ResponseSchema(RefreshTokenResponse)
    @Post('/admin/refresh-token')
    async adminRefreshToken(@HeaderParam('refresh-token') requestRefreshToken: string) {
        const decodedPayload: any = JsonWebToken.verifyJwtRefresh(requestRefreshToken);

        const admin = await this.adminService.getAdminById(decodedPayload._id);

        if (!admin) throw new UnauthorizedError('Admin not found');

        const payload = { _id: decodedPayload._id };

        const accessToken = JsonWebToken.signJwt(payload);

        const refreshToken = JsonWebToken.signJwtRefresh(payload);

        return { accessToken, refreshToken };
    }

    // User services

    @Post('/user/register')
    @ResponseSchema(UserRegisterResponse)
    async userRegister(@Body() data: UserRegisterDto) {
        let user = await this.userService.getUserByEmail(data.email);

        if (user) throw new ConflictError(`User '${data.email}' already exists`);

        user = await this.userService.createUser(data);

        const payload: Payload = { _id: user._id.toString(), role: RoleType.USER };

        const accessToken = JsonWebToken.signJwt(payload);

        const refreshToken = JsonWebToken.signJwtRefresh(payload);

        return { accessToken, refreshToken };
    }

    @ResponseSchema(LoginResponse)
    @Post('/user/login')
    async userLogin(@Body() data: LoginDto) {
        const { email, password } = data;
        const user = await this.userService.getUserByEmail(email);

        if (!user) throw new NotFoundError('User not found');

        const isValidPassword = await user.isValidPassword(password);

        if (!isValidPassword) throw new NotFoundError('User not found');

        const payload: Payload = { _id: user._id.toString(), role: RoleType.ADMIN };

        const accessToken = JsonWebToken.signJwt(payload);

        const refreshToken = JsonWebToken.signJwtRefresh(payload);

        return { accessToken, refreshToken };
    }

    @ResponseSchema(RefreshTokenResponse)
    @Post('/user/refresh-token')
    async userRefreshToken(@HeaderParam('refresh-token') requestRefreshToken: string) {
        const decodedPayload: any = JsonWebToken.verifyJwtRefresh(requestRefreshToken);

        const user = await this.userService.getUserById(decodedPayload._id);

        if (!user) throw new UnauthorizedError('User not found');

        const payload = { _id: decodedPayload._id };

        const accessToken = JsonWebToken.signJwt(payload);

        const refreshToken = JsonWebToken.signJwtRefresh(payload);

        return { accessToken, refreshToken };
    }
}
