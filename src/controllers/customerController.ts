import { Request, Response, NextFunction } from 'express';
import prisma from '../config/prisma';
import { AppError } from '../utils/AppError';
import { CreateCustomerDto, UpdateCustomerDto } from '../dtos/customer.dto';

export const createCustomer = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = req.body as CreateCustomerDto;

        // Check duplicates
        const existing = await prisma.customer.findFirst({
            where: {
                OR: [{ email: data.email }, { phone: data.phone }],
            },
        });

        if (existing) {
            throw new AppError('Customer with this email or phone already exists', 409);
        }

        const customer = await prisma.customer.create({
            data,
        });

        res.status(201).json({
            status: 'success',
            data: customer,
        });
    } catch (error) {
        next(error);
    }
};

export const getCustomers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const search = req.query.search as string;
        const skip = (page - 1) * limit;

        const where: any = {};
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
                { phone: { contains: search, mode: 'insensitive' } },
            ];
        }

        const [totalRecords, customers] = await prisma.$transaction([
            prisma.customer.count({ where }),
            prisma.customer.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
        ]);

        res.status(200).json({
            status: 'success',
            page,
            limit,
            totalRecords,
            totalPages: Math.ceil(totalRecords / limit),
            data: customers,
        });
    } catch (error) {
        next(error);
    }
};

export const getCustomerById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.id as string);
        const customer = await prisma.customer.findUnique({
            where: { id },
        });

        if (!customer) {
            throw new AppError('Customer not found', 404);
        }

        res.status(200).json({
            status: 'success',
            data: customer,
        });
    } catch (error) {
        next(error);
    }
};

export const updateCustomer = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.id as string);
        const data = req.body as UpdateCustomerDto;

        const customer = await prisma.customer.update({
            where: { id },
            data,
        });

        res.status(200).json({
            status: 'success',
            data: customer,
        });
    } catch (error: any) {
        if (error.code === 'P2025') {
            return next(new AppError('Customer not found', 404));
        }
        // Check unique constraint violation (P2002)
        if (error.code === 'P2002') {
            return next(new AppError('Email or phone already exists', 409));
        }
        next(error);
    }
};

export const deleteCustomer = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.id as string);
        await prisma.customer.delete({
            where: { id },
        });

        res.status(200).json({ // Use 200 with message or 204 no content. Brief implies just "Deletes a customer", usually 200/204.
            status: 'success',
            message: 'Customer deleted successfully',
        });
    } catch (error: any) {
        if (error.code === 'P2025') {
            return next(new AppError('Customer not found', 404));
        }
        next(error);
    }
};
