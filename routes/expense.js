const express = require('express');
const router = express.Router();
const { addExpense, getAllExpenses, getExpense, deleteExpense, updateExpense } = require('../controllers/expenseController');
const verifyFirebaseToken = require('../middleware/verifyFirebaseToken');

require("dotenv").config() 

const urlApi = process.env.URL_DEV
//data comes from the controller
router
.post(urlApi + "/add-expense", verifyFirebaseToken, addExpense)
.get(urlApi + '/fetchAllExpense', verifyFirebaseToken,getAllExpenses)
.get(urlApi + '/fetchExpense/:id', verifyFirebaseToken, getExpense)
.delete(urlApi + '/delete-expense/:id', verifyFirebaseToken, deleteExpense)
.put(urlApi + '/update-expense/:id', verifyFirebaseToken, updateExpense )

module.exports = router