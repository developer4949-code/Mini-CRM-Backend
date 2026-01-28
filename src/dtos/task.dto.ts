import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export enum TaskStatus {
    PENDING = 'PENDING',
    IN_PROGRESS = 'IN_PROGRESS',
    DONE = 'DONE',
}

export class CreateTaskDto {
    @IsNotEmpty()
    @IsString()
    title!: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsNotEmpty()
    @IsInt()
    assignedTo!: number;

    @IsNotEmpty()
    @IsInt()
    customerId!: number;

    @IsOptional()
    @IsEnum(TaskStatus)
    status?: TaskStatus;
}

export class UpdateTaskStatusDto {
    @IsNotEmpty()
    @IsEnum(TaskStatus)
    status!: TaskStatus;
}
