import { Request, Response, NextFunction } from 'express';
import { register, login } from '../services/authService';
import { RegisterDto, LoginDto } from '../dtos/auth.dto';

export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // req.body is already validated if middleware is used
        const user = await register(req.body as RegisterDto);
        res.status(201).json({
            status: 'success',
            data: user,
        });
    } catch (error) {
        next(error);
    }
};

export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await login(req.body as LoginDto);
        res.status(200).json({
            status: 'success',
            data: result,
        });
    } catch (error) {
        next(error);
    }
};
