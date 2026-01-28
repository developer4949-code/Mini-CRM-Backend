import { Router } from 'express';
import { createTask, getTasks, updateTaskStatus } from '../controllers/taskController';
import { authenticate, authorize } from '../middlewares/authMiddleware';
import { validateDto } from '../middlewares/validationMiddleware';
import { CreateTaskDto, UpdateTaskStatusDto } from '../dtos/task.dto';

const router = Router();

router.use(authenticate);

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
router.post('/', authorize(['ADMIN']), validateDto(CreateTaskDto), createTask);

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
router.get('/', getTasks);

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
router.patch('/:id/status', validateDto(UpdateTaskStatusDto), updateTaskStatus);

export default router;
