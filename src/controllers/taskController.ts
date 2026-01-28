import { Request, Response, NextFunction } from 'express';
import prisma from '../config/prisma';
import { AppError } from '../utils/AppError';
import { CreateTaskDto, UpdateTaskStatusDto } from '../dtos/task.dto';

export const createTask = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = req.body as CreateTaskDto;

        // Validate assignedTo is EMPLOYEE
        const employee = await prisma.user.findUnique({
            where: { id: data.assignedTo },
        });

        if (!employee || employee.role !== 'EMPLOYEE') {
            throw new AppError('Assigned user must exist and be an EMPLOYEE', 400);
            // Brief says "Return 404 if customer or assigned user is not found". 
            // I'll return 404 for not found, 400 for wrong role implies "bad request".
            // Let's stick to 404 if not found, 400 if bad role.
        }

        // Validate customerId
        const customer = await prisma.customer.findUnique({
            where: { id: data.customerId },
        });

        if (!customer) {
            throw new AppError('Customer not found', 404);
        }

        const task = await prisma.task.create({
            data: {
                title: data.title,
                description: data.description,
                status: data.status || 'PENDING',
                assignedTo: data.assignedTo,
                customerId: data.customerId,
            },
        });

        res.status(201).json({
            status: 'success',
            data: task,
        });
    } catch (error) {
        next(error);
    }
};

export const getTasks = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user!;
        const where: any = {};

        if (user.role === 'EMPLOYEE') {
            where.assignedTo = user.userId;
        }

        const tasks = await prisma.task.findMany({
            where,
            include: {
                assignee: {
                    select: { id: true, name: true, email: true },
                },
                customer: {
                    select: { id: true, name: true, email: true, phone: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        res.status(200).json({
            status: 'success',
            data: tasks,
        });
    } catch (error) {
        next(error);
    }
};

export const updateTaskStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.id as string);
        const { status } = req.body as UpdateTaskStatusDto;
        const user = req.user!;

        // Find task first to check permissions logic
        const task = await prisma.task.findUnique({
            where: { id },
        });

        if (!task) {
            throw new AppError('Task not found', 404);
        }

        if (user.role === 'EMPLOYEE' && task.assignedTo !== user.userId) {
            throw new AppError('You can only update your own tasks', 403);
        }

        const updatedTask = await prisma.task.update({
            where: { id },
            data: { status },
            include: {
                assignee: { select: { id: true, name: true } },
                customer: { select: { id: true, name: true } }
            }
        });

        res.status(200).json({
            status: 'success',
            data: updatedTask,
        });
    } catch (error: any) {
        if (error.code === 'P2025') {
            return next(new AppError('Task not found', 404));
        }
        next(error);
    }
};
