import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useGlobalContext } from '../../context/globalContext';
import { InnerLayout } from '../../styles/Layouts';
import ExpenseForm from './ExpenseForm';
import IncomeItem from '../IncomeItem/IncomeItem';

function Expenses() {
    const { expenses, getExpenses, deleteExpense, totalExpenses, updateExpense } = useGlobalContext();
    const [editingExpense, setEditingExpense] = useState(null);

    useEffect(() => {
        getExpenses();
    }, []);

    const handleEdit = (expense) => {
        setEditingExpense(expense);
    }

    const handleSave = async (updatedExpense) => {
        await updateExpense(updatedExpense);
        setEditingExpense(null); // Clear the editing state
    }

    return (
        <ExpenseStyled>
            <InnerLayout>
                <h1>Expenses</h1>
                <h2 className="total-income">Total Expense: <span>Rs. {totalExpenses()}</span></h2>
                <div className="income-content">
                    <div className="form-container">
                        <ExpenseForm
                            expense={editingExpense}
                            onSave={handleSave}
                            onCancel={() => setEditingExpense(null)}
                        />
                    </div>
                    <div className="incomes">
                        {expenses.map((expense) => (
                            <IncomeItem
                                key={expense._id}
                                id={expense._id}
                                title={expense.title}
                                amount={expense.amount}
                                date={expense.date}
                                category={expense.category}
                                description={expense.description}
                                type="expense"
                                indicatorColor="var(--color-green)"
                                deleteItem={deleteExpense}
                                editItem={() => handleEdit(expense)}
                            />
                        ))}
                    </div>
                </div>
            </InnerLayout>
        </ExpenseStyled>
    );
}

const ExpenseStyled = styled.div`
    display: flex;
    overflow: auto;
    .total-income{
        display: flex;
        justify-content: center;
        align-items: center;
        background: #FCF6F9;
        border: 2px solid #FFFFFF;
        box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
        border-radius: 20px;
        padding: 1rem;
        margin: 1rem 0;
        font-size: 2rem;
        gap: .5rem;
        span{
            font-size: 2.5rem;
            font-weight: 800;
            color: var(--color-green);
        }
    }
    .income-content{
        display: flex;
        gap: 2rem;
        .incomes{
            flex: 1;
        }
    }
`;

export default Expenses