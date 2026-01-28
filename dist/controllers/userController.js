"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserRole = exports.getUserById = exports.getUsers = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const AppError_1 = require("../utils/AppError");
const getUsers = async (req, res, next) => {
    try {
        const users = await prisma_1.default.user.findMany({
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
    }
    catch (error) {
        next(error);
    }
};
exports.getUsers = getUsers;
const getUserById = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const user = await prisma_1.default.user.findUnique({
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
            throw new AppError_1.AppError('User not found', 404);
        }
        res.status(200).json({
            status: 'success',
            data: user,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getUserById = getUserById;
const updateUserRole = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const { role } = req.body;
        const user = await prisma_1.default.user.update({
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
    }
    catch (error) {
        if (error.code === 'P2025') { // Prisma record not found code
            return next(new AppError_1.AppError('User not found', 404));
        }
        next(error);
    }
};
exports.updateUserRole = updateUserRole;
