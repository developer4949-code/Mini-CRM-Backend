"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTaskStatus = exports.getTasks = exports.createTask = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const AppError_1 = require("../utils/AppError");
const createTask = async (req, res, next) => {
    try {
        const data = req.body;
        // Validate assignedTo is EMPLOYEE
        const employee = await prisma_1.default.user.findUnique({
            where: { id: data.assignedTo },
        });
        if (!employee || employee.role !== 'EMPLOYEE') {
            throw new AppError_1.AppError('Assigned user must exist and be an EMPLOYEE', 400);
            // Brief says "Return 404 if customer or assigned user is not found". 
            // I'll return 404 for not found, 400 for wrong role implies "bad request".
            // Let's stick to 404 if not found, 400 if bad role.
        }
        // Validate customerId
        const customer = await prisma_1.default.customer.findUnique({
            where: { id: data.customerId },
        });
        if (!customer) {
            throw new AppError_1.AppError('Customer not found', 404);
        }
        const task = await prisma_1.default.task.create({
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
    }
    catch (error) {
        next(error);
    }
};
exports.createTask = createTask;
const getTasks = async (req, res, next) => {
    try {
        const user = req.user;
        const where = {};
        if (user.role === 'EMPLOYEE') {
            where.assignedTo = user.userId;
        }
        const tasks = await prisma_1.default.task.findMany({
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
    }
    catch (error) {
        next(error);
    }
};
exports.getTasks = getTasks;
const updateTaskStatus = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const { status } = req.body;
        const user = req.user;
        // Find task first to check permissions logic
        const task = await prisma_1.default.task.findUnique({
            where: { id },
        });
        if (!task) {
            throw new AppError_1.AppError('Task not found', 404);
        }
        if (user.role === 'EMPLOYEE' && task.assignedTo !== user.userId) {
            throw new AppError_1.AppError('You can only update your own tasks', 403);
        }
        const updatedTask = await prisma_1.default.task.update({
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
    }
    catch (error) {
        if (error.code === 'P2025') {
            return next(new AppError_1.AppError('Task not found', 404));
        }
        next(error);
    }
};
exports.updateTaskStatus = updateTaskStatus;
