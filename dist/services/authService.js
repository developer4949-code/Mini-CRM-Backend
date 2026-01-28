"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = __importDefault(require("../config/prisma"));
const AppError_1 = require("../utils/AppError");
const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET || 'secret';
const register = async (data) => {
    const existingUser = await prisma_1.default.user.findUnique({
        where: { email: data.email },
    });
    if (existingUser) {
        throw new AppError_1.AppError('Email already exists', 400);
    }
    const hashedPassword = await bcrypt_1.default.hash(data.password, SALT_ROUNDS);
    const user = await prisma_1.default.user.create({
        data: {
            name: data.name,
            email: data.email,
            password: hashedPassword,
            role: data.role,
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
        },
    });
    return user;
};
exports.register = register;
const login = async (data) => {
    const user = await prisma_1.default.user.findUnique({
        where: { email: data.email },
    });
    if (!user) {
        throw new AppError_1.AppError('Invalid email or password', 401);
    }
    const isPasswordValid = await bcrypt_1.default.compare(data.password, user.password);
    if (!isPasswordValid) {
        throw new AppError_1.AppError('Invalid email or password', 401);
    }
    const token = jsonwebtoken_1.default.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
    return {
        accessToken: token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
    };
};
exports.login = login;
