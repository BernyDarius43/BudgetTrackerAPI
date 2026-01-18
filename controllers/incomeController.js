const Income = require('../models/incomeModel');


exports.addIncome = async (req, res) => {
    console.log("ADD Income function called");
    const { title, amount, type, date, category, description } = req.body;
    const { uid } = req.firebase;
    if (!title || !amount || !date || !category) {
        return res.status(400).json({ message: "All fields are required!" });
    }

    // Ensure amount is a number
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount)) {
        return res.status(400).json({ message: "Amount must be a number!" });
    }

    try {
        const newIncome = new Income({
            uid,
            title,
            amount: parsedAmount,
            type,
            date,
            category,
            description,
        })
        console.log(newIncome);
        await newIncome.save();
        console.log("Added income successfully");
        return res.status(201).json(newIncome);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({error: 'Failed to create income'})
    }
}

exports.getAllIncomes = async (req, res) => {
    console.log("GET all Incomes function called");
    try {
        // Assuming req.user.firebaseUid is populated by your authentication middleware
        const { uid } = req.firebase;
        console.log("Fetching incomes for firebase user:", uid);

        // Fetch incomes for the authenticated user
        
        const incomes = await Income.find({ uid }); 
        
        // Send the incomes as a JSON response
        return res.status(200).json(incomes);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: 'Failed to fetch incomes' });
    }
}

exports.deleteIncome = async (req, res) => {
    console.log("DELETE Income function called");
    const { uid } = req.firebase;
    const { id } = req.params;
    console.log("Income id:", id);
    
    try {
        // Attempt to find and delete the income
        const result = await Income.findOneAndDelete({ _id: id, uid });

        if (!result) {
            // If no matching income is found, return a 404 error
            return res.status(404).json({ error: 'Income not found' });
        }

        // If deletion is successful, send a success message
        console.log("Income deleted sucessfully!", result);
        return res.status(200).json({ message: "Income deleted successfully" });
    } catch (error) {
        // Handle any other errors
        console.error("Error:", error);
        res.status(500).json({ message: "Server error: " + error.message });
    }
}

exports.getIncome = async (req, res) => {
    console.log("GET income function called");
    const {id} = req.params;
    const { uid } = req.firebase;

    try {
        const result = await Income.findOne({ _id: id, uid });
        if (!result) {
            return res.status(404).json({ error: 'Income not found' });
        }
        return res.status(200).json({ income: result, message: 'Income retrieved' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch income' });
    }
}

exports.updateIncome = async (req, res) => {
    console.log("UPDATE income function called");
    const { uid } = req.firebase;
    const {id} = req.params;
    const { title, amount, type, date, category, description } = req.body;
    try {
        const result = await Income.findOneAndUpdate(
            { _id: id, uid },
            { title, amount, type, date, category, description },
            { new: true, runValidators: true }
        )
        if (!result) {
            return res.status(404).json({ error: "Income not found" });
        }
        console.log("Income updated successfully", result);

        return res.status(200).json(result)
    } catch (error) {
        console.log("Failed to update income",error)
        res.status(500).json({ error: 'Failed to update income' });
    }
}