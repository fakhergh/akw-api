import { IsString } from 'class-validator';

export class LoginResponse {
    @IsString()
    accessToken!: string;

    @IsString()
    refreshToken!: string;
}

export class RefreshTokenResponse {
    @IsString()
    accessToken!: string;

    @IsString()
    refreshToken!: string;
}

export class UserRegisterResponse {
    @IsString()
    accessToken!: string;

    @IsString()
    refreshToken!: string;
}
