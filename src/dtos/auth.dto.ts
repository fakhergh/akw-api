import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
    @IsNotEmpty()
    @IsEmail()
    @IsString()
    email!: string;

    @IsNotEmpty()
    @IsString()
    password!: string;
}

export class UserRegisterDto {
    @IsNotEmpty()
    @IsString()
    firstName!: string;

    @IsNotEmpty()
    @IsString()
    lastName!: string;

    @IsNotEmpty()
    @IsEmail()
    @IsString()
    email!: string;

    @IsNotEmpty()
    @IsString()
    password!: string;
}

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
