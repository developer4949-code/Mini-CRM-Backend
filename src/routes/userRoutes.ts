import { Router } from 'express';
import { getUsers, getUserById, updateUserRole } from '../controllers/userController';
import { authenticate, authorize } from '../middlewares/authMiddleware';
import { validateDto } from '../middlewares/validationMiddleware';
import { UpdateUserRoleDto } from '../dtos/user.dto';

const router = Router();

// Protect all routes
router.use(authenticate);
router.use(authorize(['ADMIN']));

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
router.get('/', getUsers);

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
router.get('/:id', getUserById);

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
router.patch('/:id', validateDto(UpdateUserRoleDto), updateUserRole);

export default router;
