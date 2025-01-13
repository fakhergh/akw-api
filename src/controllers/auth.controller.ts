import { StatusCodes } from 'http-status-codes';
import {
    Authorized,
    Body,
    CurrentUser,
    Get,
    HeaderParam,
    HttpCode,
    JsonController,
    NotFoundError,
    Post,
    UnauthorizedError,
} from 'routing-controllers';
import { ResponseSchema } from 'routing-controllers-openapi';
import { Container } from 'typedi';

import {
    LoginDto,
    LoginResponse,
    RefreshTokenResponse,
    UserRegisterDto,
    UserRegisterResponse,
} from '@/dtos/auth.dto';
import { ConflictError } from '@/errors';
import { Admin } from '@/models/admin.model';
import { User } from '@/models/user.model';
import { AdminService } from '@/services/admin.service';
import { UserService } from '@/services/user.service';
import { RoleType } from '@/types/auth.type';
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
        const decodedPayload: Payload = JsonWebToken.verifyJwtRefresh(requestRefreshToken);

        const admin = await this.adminService.getAdminById(decodedPayload._id);

        if (!admin) throw new UnauthorizedError('Admin not found');

        const payload = { _id: decodedPayload._id, role: RoleType.ADMIN };

        const accessToken = JsonWebToken.signJwt(payload);

        const refreshToken = JsonWebToken.signJwtRefresh(payload);

        return { accessToken, refreshToken };
    }

    @Get('/admin/me')
    @Authorized(RoleType.ADMIN)
    @ResponseSchema(Admin)
    adminProfile(@CurrentUser() admin: Admin) {
        return admin;
    }

    // User services

    @HttpCode(StatusCodes.CREATED)
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

        const payload: Payload = { _id: user._id.toString(), role: RoleType.USER };

        const accessToken = JsonWebToken.signJwt(payload);

        const refreshToken = JsonWebToken.signJwtRefresh(payload);

        return { accessToken, refreshToken };
    }

    @ResponseSchema(RefreshTokenResponse)
    @Post('/user/refresh-token')
    async userRefreshToken(@HeaderParam('refresh-token') requestRefreshToken: string) {
        const decodedPayload: Payload = JsonWebToken.verifyJwtRefresh(requestRefreshToken);

        const user = await this.userService.getUserById(decodedPayload._id);

        if (!user) throw new UnauthorizedError('User not found');

        const payload = { _id: decodedPayload._id, role: RoleType.USER };

        const accessToken = JsonWebToken.signJwt(payload);

        const refreshToken = JsonWebToken.signJwtRefresh(payload);

        return { accessToken, refreshToken };
    }

    @Get('/user/me')
    @Authorized(RoleType.USER)
    @ResponseSchema(User)
    userProfile(@CurrentUser() user: User) {
        return user;
    }
}
