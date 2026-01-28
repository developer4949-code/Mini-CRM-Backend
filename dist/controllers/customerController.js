"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCustomer = exports.updateCustomer = exports.getCustomerById = exports.getCustomers = exports.createCustomer = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const AppError_1 = require("../utils/AppError");
const createCustomer = async (req, res, next) => {
    try {
        const data = req.body;
        // Check duplicates
        const existing = await prisma_1.default.customer.findFirst({
            where: {
                OR: [{ email: data.email }, { phone: data.phone }],
            },
        });
        if (existing) {
            throw new AppError_1.AppError('Customer with this email or phone already exists', 409);
        }
        const customer = await prisma_1.default.customer.create({
            data,
        });
        res.status(201).json({
            status: 'success',
            data: customer,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.createCustomer = createCustomer;
const getCustomers = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search;
        const skip = (page - 1) * limit;
        const where = {};
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
                { phone: { contains: search, mode: 'insensitive' } },
            ];
        }
        const [totalRecords, customers] = await prisma_1.default.$transaction([
            prisma_1.default.customer.count({ where }),
            prisma_1.default.customer.findMany({
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
    }
    catch (error) {
        next(error);
    }
};
exports.getCustomers = getCustomers;
const getCustomerById = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const customer = await prisma_1.default.customer.findUnique({
            where: { id },
        });
        if (!customer) {
            throw new AppError_1.AppError('Customer not found', 404);
        }
        res.status(200).json({
            status: 'success',
            data: customer,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getCustomerById = getCustomerById;
const updateCustomer = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const data = req.body;
        const customer = await prisma_1.default.customer.update({
            where: { id },
            data,
        });
        res.status(200).json({
            status: 'success',
            data: customer,
        });
    }
    catch (error) {
        if (error.code === 'P2025') {
            return next(new AppError_1.AppError('Customer not found', 404));
        }
        // Check unique constraint violation (P2002)
        if (error.code === 'P2002') {
            return next(new AppError_1.AppError('Email or phone already exists', 409));
        }
        next(error);
    }
};
exports.updateCustomer = updateCustomer;
const deleteCustomer = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        await prisma_1.default.customer.delete({
            where: { id },
        });
        res.status(200).json({
            status: 'success',
            message: 'Customer deleted successfully',
        });
    }
    catch (error) {
        if (error.code === 'P2025') {
            return next(new AppError_1.AppError('Customer not found', 404));
        }
        next(error);
    }
};
exports.deleteCustomer = deleteCustomer;
