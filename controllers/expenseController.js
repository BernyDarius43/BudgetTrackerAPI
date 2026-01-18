const Expense = require('../models/expenseModel');



exports.addExpense = async (req, res) => {
   try {
     console.log("ADD expense function called");
    const { title, amount, type, date, category, description } = req.body;
     const { uid } = req.firebase;

     if (!title || !amount || !date || !category) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    const parsedAmount = parseFloat(amount);
    if (Number.isNaN(parsedAmount) || parsedAmount <= 0) {
      return res.status(400).json({ message: "Amount must be a positive number" });
    }

        const expense = new Expense({
            uid,
            title,
            amount: parsedAmount,
            type,
            date,
            category,
            description,
          });
        const newExpense = expense;
        console.log("Expense", newExpense);
        
        const result = await newExpense.save();
        return res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create expense' });
    }
}

exports.getAllExpenses = async (req, res) => {
    console.log("GET all expenses function called");
    try {
        const { uid } = req.firebase;
        const expenses = await Expense.find({uid});
        return res.status(200).json(expenses);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch expenses' });
    }
}

exports.deleteExpense = async (req, res) => {
    console.log("DELETE expense function called");
       const { id } = req.params;
        const { uid } = req.firebase;
       try {
        const result = await Expense.findOneAndDelete({_id: id, uid});
        if (!result) {
            return res.status(404).json({ error: 'Expense not found' });
          }
          console.log("Expense deleted successfully", result);
          return res.status(200).json({message: "Expense Deleted successfully"})
       } catch (error) {
        res.status(500).json({ error: 'Failed to delete expense' });
       }
}

exports.getExpense = async (req, res) => {
    console.log("GET expense function called");
    const { uid } = req.firebase;
  const { id } = req.params;
    
    try {
    const result = await Expense.findOne({ _id: id, uid });
    if (!result) {
            return res.status(404).json({ error: 'Expense not found' });
        }
        console.log("Expense", result);
        
        return res.status(200).json({ expense: result, message: 'Expense retrieved' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch expense' });
    }
}

exports.updateExpense = async (req, res) => {
    console.log("Update expense function called");
    const { uid } = req.firebase;
    const {id} = req.params;
    const { title, amount, type, date, category, description } = req.body;
    try {
        const result = await Expense.findOneAndUpdate(
            { _id: id, uid },
            { title, amount, type, date, category, description },
            { new: true, runValidators: true });
if (!result) {
        return res.status(404).json({ error: 'Expense not found' });
      }
      console.log("Expense updated successfully", result);
      return res.status(200).json(result)
    } catch (error) {
        res.status(500).json({ error: 'Failed to update expense' });
    }
}