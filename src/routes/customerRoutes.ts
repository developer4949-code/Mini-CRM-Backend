import { Router } from 'express';
import { createCustomer, getCustomers, getCustomerById, updateCustomer, deleteCustomer } from '../controllers/customerController';
import { authenticate, authorize } from '../middlewares/authMiddleware';
import { validateDto } from '../middlewares/validationMiddleware';
import { CreateCustomerDto, UpdateCustomerDto } from '../dtos/customer.dto';

const router = Router();

router.use(authenticate);

// Public to Employees and Admins
/**
 * @swagger
 * /customers:
 *   get:
 *     summary: Get customers with pagination
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by name, email, or phone
 *     responses:
 *       200:
 *         description: List of customers
 */
router.get('/', authorize(['ADMIN', 'EMPLOYEE']), getCustomers);

/**
 * @swagger
 * /customers/{id}:
 *   get:
 *     summary: Get customer by ID
 *     tags: [Customers]
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
 *         description: Customer details
 *       404:
 *         description: Not found
 */
router.get('/:id', authorize(['ADMIN', 'EMPLOYEE']), getCustomerById);

// Admin OnlyRoutes
/**
 * @swagger
 * /customers:
 *   post:
 *     summary: Create a new customer (Admin only)
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCustomerDto'
 *     responses:
 *       201:
 *         description: Created
 *       409:
 *         description: Conflict
 */
router.post('/', authorize(['ADMIN']), validateDto(CreateCustomerDto), createCustomer);

/**
 * @swagger
 * /customers/{id}:
 *   patch:
 *     summary: Update customer (Admin only)
 *     tags: [Customers]
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
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 phone:
 *                   type: string
 *                 company:
 *                   type: string
 *     responses:
 *       200:
 *         description: Updated
 */
router.patch('/:id', authorize(['ADMIN']), validateDto(UpdateCustomerDto), updateCustomer);

/**
 * @swagger
 * /customers/{id}:
 *   delete:
 *     summary: Delete customer (Admin only)
 *     tags: [Customers]
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
 *         description: Deleted
 */
router.delete('/:id', authorize(['ADMIN']), deleteCustomer);

export default router;
