"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const errorHandler_1 = require("./middlewares/errorHandler");
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)());
app.use((0, helmet_1.default)());
app.use(express_1.default.json());
// Swagger Setup
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Mini CRM API',
            version: '1.0.0',
            description: 'API Documentation for Mini CRM Backend',
        },
        servers: [
            {
                url: 'http://localhost:3000',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: ['./src/routes/*.ts'], // Path to the API docs
};
const swaggerDocs = (0, swagger_jsdoc_1.default)(swaggerOptions);
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocs));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const customerRoutes_1 = __importDefault(require("./routes/customerRoutes"));
const taskRoutes_1 = __importDefault(require("./routes/taskRoutes"));
// Routes
app.use('/auth', authRoutes_1.default);
app.use('/users', userRoutes_1.default);
app.use('/customers', customerRoutes_1.default);
app.use('/tasks', taskRoutes_1.default);
app.get('/', (req, res) => {
    res.send('Mini CRM Backend API is running. Documentation at /api-docs');
});
// Error Handling
app.use(errorHandler_1.errorHandler);
exports.default = app;
