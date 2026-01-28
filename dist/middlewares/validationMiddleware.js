"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const AppError_1 = require("../utils/AppError");
const validateDto = (dtoClass) => {
    return async (req, res, next) => {
        const dtoObj = (0, class_transformer_1.plainToInstance)(dtoClass, req.body);
        const errors = await (0, class_validator_1.validate)(dtoObj);
        if (errors.length > 0) {
            const errorMessages = errors.map(error => Object.values(error.constraints || {}).join(', ')).join('; ');
            return next(new AppError_1.AppError(`Validation Failed: ${errorMessages}`, 400));
        }
        req.body = dtoObj; // Optional: replace body with typed object
        next();
    };
};
exports.validateDto = validateDto;
