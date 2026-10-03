/**
 * @openapi
 * /api/v1/expenses:
 *   get:
 *     tags: [Expense]
 *     summary: Get all expenses
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of expenses
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TransactionBase'
 *   post:
 *     tags: [Expense]
 *     summary: Create expense
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ExpenseCreate'
 *     responses:
 *       201:
 *         description: Created
 */
/**
 * @openapi
 * /api/v1/expenses/{id}:
 *   get:
 *     tags: [Expense]
 *     summary: Get expense by id
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Expense object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TransactionBase'
 *   put:
 *     tags: [Expense]
 *     summary: Update expense
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TransactionUpdate'
 *     responses:
 *       200:
 *         description: Updated
 *   delete:
 *     tags: [Expense]
 *     summary: Delete expense
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Deleted
 */
const express = require('express');
const router = express.Router();
const { addExpense, getAllExpenses, getExpense, deleteExpense, updateExpense } = require('../controllers/expenseController');
const verifyFirebaseToken = require('../middleware/verifyFirebaseToken');
//data comes from the controller
router
.post("/expenses", verifyFirebaseToken, addExpense)
.get('/expenses', verifyFirebaseToken, getAllExpenses)
.get('/expenses/:id', verifyFirebaseToken, getExpense)
.delete('/expenses/:id', verifyFirebaseToken, deleteExpense)
.put('/expenses/:id', verifyFirebaseToken, updateExpense )

module.exports = router