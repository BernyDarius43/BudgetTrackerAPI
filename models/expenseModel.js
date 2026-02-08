const mongoose = require('mongoose')

const ExpenseSchema = new mongoose.Schema({
    uid: {
        type: String,
        required: true,
        index: true,
      },
    
    title: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    },
    amount: {
        type: Number,
        required: true,
        trim: true,
        maxLength: 20
    },
    type: {
        type: String,
        default: "Expense"
    },
    date: {
        type: Date,
        required: true,
        trim: true,
    },
    category: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
        maxLength: 50
    },
}, {timestamps: true})

const Expense = mongoose.model('Expense', ExpenseSchema)
module.exports = Expense 