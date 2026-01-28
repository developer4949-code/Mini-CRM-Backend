"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const customerController_1 = require("../controllers/customerController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const validationMiddleware_1 = require("../middlewares/validationMiddleware");
const customer_dto_1 = require("../dtos/customer.dto");
const router = (0, express_1.Router)();
router.use(authMiddleware_1.authenticate);
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
router.get('/', (0, authMiddleware_1.authorize)(['ADMIN', 'EMPLOYEE']), customerController_1.getCustomers);
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
router.get('/:id', (0, authMiddleware_1.authorize)(['ADMIN', 'EMPLOYEE']), customerController_1.getCustomerById);
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
router.post('/', (0, authMiddleware_1.authorize)(['ADMIN']), (0, validationMiddleware_1.validateDto)(customer_dto_1.CreateCustomerDto), customerController_1.createCustomer);
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
router.patch('/:id', (0, authMiddleware_1.authorize)(['ADMIN']), (0, validationMiddleware_1.validateDto)(customer_dto_1.UpdateCustomerDto), customerController_1.updateCustomer);
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
router.delete('/:id', (0, authMiddleware_1.authorize)(['ADMIN']), customerController_1.deleteCustomer);
exports.default = router;
