const IncomeSchema = require("../models/IncomeModel");
const checkAuthentication = require('../middleware/checkAuthentication');

exports.addIncome = [
    checkAuthentication,
    async (req, res) => {
        const { title, amount, category, description, date } = req.body;
        const userId = req.user.googleId;

        const income = new IncomeSchema({
            userId,
            title,
            amount,
            category,
            description,
            date,
        });

        // console.log(income);

        try {
            // Validations
            if (!title || !category || !description || !date) {
                return res.status(400).json({ message: 'All fields are required!' });
            }
            if(amount <= 0 || !amount === 'number'){
                return res.status(400).json({message: 'Amount must be a positive number!'})
            }
            await income.save();
            res.status(200).json({ message: 'Income Added' });
        } catch (error) {
            res.status(500).json({ message: 'Server Error' });
        }
    }
];

exports.getIncomes = [
    checkAuthentication,
    async (req, res) => {
        console.log(req.user);
        const userId = req.user.googleId;
        try {
            const incomes = await IncomeSchema.find({ userId }).sort({ createdAt: -1 });
            res.status(200).json(incomes);
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Server Error' });
        }
    }
];

exports.deleteIncome = [
    checkAuthentication,
    async (req, res) => {
        const { id } = req.params;
        const userId = req.user.googleId;

        try {
            const income = await IncomeSchema.findOneAndDelete({ _id: id, userId });
            if (!income) {
                return res.status(404).json({ message: 'Income not found' });
            }
            res.status(200).json({ message: 'Income Deleted' });
        } catch (err) {
            res.status(500).json({ message: 'Server Error' });
        }
    }
];

exports.updateIncome = [
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

            const updatedIncome = await IncomeSchema.findOneAndUpdate(
                { _id: id, userId },
                { title, amount, category, description, date },
                { new: true } // Return the updated document
            );

            if (!updatedIncome) {
                return res.status(404).json({ message: 'Income not found' });
            }

            res.status(200).json({ message: 'Income Updated', data: updatedIncome });
        } catch (error) {
            res.status(500).json({ message: 'Server Error' });
        }
    }
];