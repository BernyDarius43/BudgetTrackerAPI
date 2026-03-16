const express = require('express');
const router = express.Router();


//data comes from the controller
router.get('/home', (req, res) => {
    console.log("Home route successfull");
    console.info(req.baseUrl);
    
    res.send("Welcome to your budgetTracker!!")
})

module.exports = router