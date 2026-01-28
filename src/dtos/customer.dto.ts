import { IsEmail, IsNotEmpty, IsOptional, IsString, IsPhoneNumber } from 'class-validator';

export class CreateCustomerDto {
    @IsNotEmpty()
    @IsString()
    name!: string;

    @IsNotEmpty()
    @IsEmail()
    email!: string;

    @IsNotEmpty()
    @IsString()
    // @IsPhoneNumber() // Optional: strict phone validation if needed, simply IsString for now to avoid lib issues
    phone!: string;

    @IsOptional()
    @IsString()
    company?: string;
}

export class UpdateCustomerDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsEmail()
    email?: string;

    @IsOptional()
    @IsString()
    phone?: string;

    @IsOptional()
    @IsString()
    company?: string;
}
