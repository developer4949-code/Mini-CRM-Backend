import { Request, Response, NextFunction } from 'express';
import prisma from '../config/prisma';
import { AppError } from '../utils/AppError';
import { UpdateUserRoleDto } from '../dtos/user.dto';

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
            },
        });

        res.status(200).json({
            status: 'success',
            data: users,
        });
    } catch (error) {
        next(error);
    }
};

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.id as string);
        const user = await prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
            },
        });

        if (!user) {
            throw new AppError('User not found', 404);
        }

        res.status(200).json({
            status: 'success',
            data: user,
        });
    } catch (error) {
        next(error);
    }
};

export const updateUserRole = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.id as string);
        const { role } = req.body as UpdateUserRoleDto;

        const user = await prisma.user.update({
            where: { id },
            data: { role },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
            },
        });

        res.status(200).json({
            status: 'success',
            data: user,
        });
    } catch (error: any) {
        if (error.code === 'P2025') { // Prisma record not found code
            return next(new AppError('User not found', 404));
        }
        next(error);
    }
};
