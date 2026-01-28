"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const taskController_1 = require("../controllers/taskController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const validationMiddleware_1 = require("../middlewares/validationMiddleware");
const task_dto_1 = require("../dtos/task.dto");
const router = (0, express_1.Router)();
router.use(authMiddleware_1.authenticate);
/**
 * @swagger
 * /tasks:
 *   post:
 *     summary: Create a new task (Admin only)
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateTaskDto'
 *     responses:
 *       201:
 *         description: Created
 */
router.post('/', (0, authMiddleware_1.authorize)(['ADMIN']), (0, validationMiddleware_1.validateDto)(task_dto_1.CreateTaskDto), taskController_1.createTask);
/**
 * @swagger
 * /tasks:
 *   get:
 *     summary: Get all tasks (Admin) or Assigned tasks (Employee)
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of tasks
 */
router.get('/', taskController_1.getTasks);
/**
 * @swagger
 * /tasks/{id}/status:
 *   patch:
 *     summary: Update task status
 *     tags: [Tasks]
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
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [PENDING, IN_PROGRESS, DONE]
 *     responses:
 *       200:
 *         description: Updated
 *       403:
 *         description: Forbidden (Employee updating other's task)
 */
router.patch('/:id/status', (0, validationMiddleware_1.validateDto)(task_dto_1.UpdateTaskStatusDto), taskController_1.updateTaskStatus);
exports.default = router;
