import React from 'react';
import { useTransaction } from '../context/TransactionContext';
import { TrendingUp, TrendingDown } from 'lucide-react';

const IncomeExpenses = () => {
  const { income, expense } = useTransaction();

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="income-expenses-grid">
      <div className="income-card">
        <div className="card-header">
          <TrendingUp className="card-icon income-icon" />
          <h3>Income</h3>
        </div>
        <div className="amount-display">
          <span className="amount positive">{formatCurrency(income)}</span>
        </div>
      </div>
      
      <div className="expense-card">
        <div className="card-header">
          <TrendingDown className="card-icon expense-icon" />
          <h3>Expenses</h3>
        </div>
        <div className="amount-display">
          <span className="amount negative">{formatCurrency(expense)}</span>
        </div>
      </div>
    </div>
  );
};

export default IncomeExpenses;
