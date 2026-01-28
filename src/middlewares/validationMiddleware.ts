import { Request, Response, NextFunction } from 'express';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { AppError } from '../utils/AppError';

export const validateDto = (dtoClass: any) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const dtoObj = plainToInstance(dtoClass, req.body);
        const errors = await validate(dtoObj);

        if (errors.length > 0) {
            const errorMessages = errors.map(error =>
                Object.values(error.constraints || {}).join(', ')
            ).join('; ');

            return next(new AppError(`Validation Failed: ${errorMessages}`, 400));
        }

        req.body = dtoObj; // Optional: replace body with typed object
        next();
    };
};
