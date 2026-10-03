/**
 * @openapi
 * /api/v1/incomes:
 *   get:
 *     tags: [Income]
 *     summary: Get all incomes
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of incomes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TransactionBase'
 *   post:
 *     tags: [Income]
 *     summary: Create income
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/IncomeCreate'
 *     responses:
 *       201:
 *         description: Created
 */
/**
 * @openapi
 * /api/v1/incomes/{id}:
 *   get:
 *     tags: [Income]
 *     summary: Get income by id
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
 *         description: Income object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TransactionBase'
 *   put:
 *     tags: [Income]
 *     summary: Update income
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
 *     tags: [Income]
 *     summary: Delete income
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
const { addIncome, getIncome, getAllIncomes, deleteIncome, updateIncome } = require('../controllers/incomeController');
const verifyFirebaseToken = require('../middleware/verifyFirebaseToken');
//data comes from the controller
router
.post("/incomes", verifyFirebaseToken, addIncome)
.get('/incomes', verifyFirebaseToken, getAllIncomes)
.get('/incomes/:id', verifyFirebaseToken, getIncome)
.delete('/incomes/:id', verifyFirebaseToken, deleteIncome)
.put('/incomes/:id', verifyFirebaseToken, updateIncome )

module.exports = router