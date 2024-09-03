const ExpenseSchema = require("../models/ExpenseModel");
const checkAuthentication = require('../middleware/checkAuthentication');

exports.addExpense = [
    checkAuthentication,
    async (req, res) => {
        const { title, amount, category, description, date } = req.body;
        const userId = req.user.googleId;

        const expense = new ExpenseSchema({
            userId,
            title,
            amount,
            category,
            description,
            date            
        });

        try {
            // Validations
            if (!title || !category || !description || !date) {
                return res.status(400).json({ message: 'All fields are required!' });
            }
            if(amount <= 0 || !amount === 'number'){
                return res.status(400).json({message: 'Amount must be a positive number!'})
            }
            await expense.save();
            res.status(200).json({ message: 'Expense Added' });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Server Error' });
        }

        console.log(expense);
    }
];

exports.getExpense = [
    checkAuthentication,
    async (req, res) => {
        const userId = req.user.googleId;
        try {
            const expenses = await ExpenseSchema.find({ userId }).sort({ createdAt: -1 });
            res.status(200).json(expenses);
        } catch (error) {
            res.status(500).json({ message: 'Server Error' });
        }
    }
];

exports.deleteExpense = [
    checkAuthentication,
    async (req, res) => {
        const { id } = req.params;
        const userId = req.user.googleId;

        try {
            const expense = await ExpenseSchema.findOneAndDelete({ _id: id, userId });
            if (!expense) {
                return res.status(404).json({ message: 'Expense not found' });
            }
            res.status(200).json({ message: 'Expense Deleted' });
        } catch (err) {
            res.status(500).json({ message: 'Server Error' });
        }
    }
];

exports.updateExpense = [
    checkAuthentication,
    async (req, res) => {
        const { id } = req.params;
        const { title, amount, category, description, date } = req.body;
        const userId = req.user.googleId;

        try {
            // Validations
            if (!title || !category || !description || !date) {
                return res.status(400).json({ message: 'All fields are required!' });
            }
            if(amount <= 0 || !amount === 'number'){
                return res.status(400).json({message: 'Amount must be a positive number!'})
            }

            const updatedExpense = await ExpenseSchema.findOneAndUpdate(
                { _id: id, userId },
                { title, amount, category, description, date },
                { new: true } // Return the updated document
            );

            if (!updatedExpense) {
                return res.status(404).json({ message: 'Expense not found' });
            }

            res.status(200).json({ message: 'Expense Updated', data: updatedExpense });
        } catch (error) {
            res.status(500).json({ message: 'Server Error' });
        }
    }
];