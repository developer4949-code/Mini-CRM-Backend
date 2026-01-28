import { IsEmail, IsEnum, IsNotEmpty, MinLength, IsString } from 'class-validator';

export enum Role {
    ADMIN = 'ADMIN',
    EMPLOYEE = 'EMPLOYEE',
}

export class RegisterDto {
    @IsNotEmpty()
    @IsString()
    name!: string;

    @IsNotEmpty()
    @IsEmail()
    email!: string;

    @IsNotEmpty()
    @MinLength(8, { message: 'Password must be at least 8 characters long' })
    password!: string;

    @IsNotEmpty()
    @IsEnum(Role)
    role!: Role;
}

export class LoginDto {
    @IsNotEmpty()
    @IsEmail()
    email!: string;

    @IsNotEmpty()
    password!: string;
}
