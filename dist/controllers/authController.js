"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.registerUser = void 0;
const authService_1 = require("../services/authService");
const registerUser = async (req, res, next) => {
    try {
        // req.body is already validated if middleware is used
        const user = await (0, authService_1.register)(req.body);
        res.status(201).json({
            status: 'success',
            data: user,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.registerUser = registerUser;
const loginUser = async (req, res, next) => {
    try {
        const result = await (0, authService_1.login)(req.body);
        res.status(200).json({
            status: 'success',
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.loginUser = loginUser;
