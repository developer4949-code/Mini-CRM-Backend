"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const validationMiddleware_1 = require("../middlewares/validationMiddleware");
const user_dto_1 = require("../dtos/user.dto");
const router = (0, express_1.Router)();
// Protect all routes
router.use(authMiddleware_1.authenticate);
router.use((0, authMiddleware_1.authorize)(['ADMIN']));
/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 */
router.get('/', userController_1.getUsers);
/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get user by ID (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User details
 *       404:
 *         description: User not found
 */
router.get('/:id', userController_1.getUserById);
/**
 * @swagger
 * /users/{id}:
 *   patch:
 *     summary: Update user role (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - role
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [ADMIN, EMPLOYEE]
 *     responses:
 *       200:
 *         description: User role updated
 *       404:
 *         description: User not found
 */
router.patch('/:id', (0, validationMiddleware_1.validateDto)(user_dto_1.UpdateUserRoleDto), userController_1.updateUserRole);
exports.default = router;
