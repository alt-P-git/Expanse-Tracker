import React, { useContext, useState } from "react";
import axios from 'axios';

const BASE_URL = "http://localhost:4000/api/v1/";

const GlobalContext = React.createContext();

export const GlobalProvider = ({ children }) => {
    const [incomes, setIncomes] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [error, setError] = useState(null);

    // Add Income
    const addIncome = async (income) => {
        const response = await axios.post(`${BASE_URL}add-income`, income, {
            withCredentials: true
        }).catch((err) => {
            setError(err.response.data.message);
        });
        getIncomes();
    };

    // Get Incomes
    const getIncomes = async () => {
        const response = await axios.get(`${BASE_URL}get-incomes`, {
            withCredentials: true
        });
        setIncomes(response.data);
    };

    // Delete Income
    const deleteIncome = async (id) => {
        const response = await axios.delete(`${BASE_URL}delete-income/${id}`, {
            withCredentials: true
        });
        getIncomes();
    };

    // Update Income
    const updateIncome = async (income) => {
        const response = await axios.put(`${BASE_URL}update-income/${income._id}`, income, {
            withCredentials: true
        });
        getIncomes();
    };

    // Add Expense
    const addExpense = async (expense) => {
        const response = await axios.post(`${BASE_URL}add-expense`, expense, {
            withCredentials: true
        }).catch((err) => {
            setError(err.response.data.message);
        });
        getExpenses();
    };

    // Get Expenses
    const getExpenses = async () => {
        const response = await axios.get(`${BASE_URL}get-expenses`, {
            withCredentials: true
        });
        setExpenses(response.data);
    };

    // Delete Expense
    const deleteExpense = async (id) => {
        const response = await axios.delete(`${BASE_URL}delete-expense/${id}`, {
            withCredentials: true
        });
        getExpenses();
    };

    // Update Expense
    const updateExpense = async (expense) => {
        const response = await axios.put(`${BASE_URL}update-expense/${expense._id}`, expense, {
            withCredentials: true
        });
        getExpenses();
    };

    // Calculate total incomes and expenses, and return balance
    const totalIncome = () => incomes.reduce((total, income) => total + income.amount, 0);
    const totalExpenses = () => expenses.reduce((total, expense) => total + expense.amount, 0);
    const totalBalance = () => totalIncome() - totalExpenses();

    // Transaction history
    const transactionHistory = () => {
        const history = [...incomes, ...expenses];
        history.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        return history.slice(0, 3);
    };

    return (
        <GlobalContext.Provider value={{
            addIncome,
            getIncomes,
            incomes,
            deleteIncome,
            updateIncome,
            expenses,
            totalIncome,
            addExpense,
            getExpenses,
            deleteExpense,
            updateExpense,
            totalExpenses,
            totalBalance,
            transactionHistory,
            error,
            setError
        }}>
            {children}
        </GlobalContext.Provider>
    );
};

export const useGlobalContext = () => useContext(GlobalContext);