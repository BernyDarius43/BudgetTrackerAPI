const express = require('express');
const router = express.Router();


//data comes from the controller
router.get('/home', (req, res) => {

    res.send("Welcome to your budgetTracker!!")
})

module.exports = router