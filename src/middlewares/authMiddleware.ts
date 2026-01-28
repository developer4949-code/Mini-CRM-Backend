import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from '../utils/AppError';

// Extend Express Request type
declare global {
    namespace Express {
        interface Request {
            user?: {
                userId: number;
                role: string;
            };
        }
    }
}

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next(new AppError('Unauthorized access', 401));
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: number; role: string };
        req.user = decoded;
        next();
    } catch (error) {
        return next(new AppError('Invalid token', 401));
    }
};

export const authorize = (roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return next(new AppError('Forbidden: Insufficient rights', 403));
        }
        next();
    };
};
