const express = require('express');
const router = express.Router();
const { addIncome, getIncome, getAllIncomes, deleteIncome, updateIncome } = require('../controllers/incomeController');
const verifyFirebaseToken = require('../middleware/verifyFirebaseToken');


const urlApi = process.env.URL_DEV
//data comes from the controller
router
.post(urlApi + "/addIncome", verifyFirebaseToken, addIncome)
.get(urlApi + '/fetchAllIncomes', verifyFirebaseToken, getAllIncomes)
.get(urlApi + '/fetchIncome/:id', verifyFirebaseToken, getIncome)
.delete(urlApi + '/delete-income/:id', verifyFirebaseToken, deleteIncome)
.put(urlApi + '/update-income/:id', verifyFirebaseToken, updateIncome )

module.exports = router