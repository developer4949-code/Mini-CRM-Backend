import { IsEnum, IsNotEmpty } from 'class-validator';
import { Role } from './auth.dto';

export class UpdateUserRoleDto {
    @IsNotEmpty()
    @IsEnum(Role)
    role!: Role;
}
