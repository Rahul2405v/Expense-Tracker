import React from 'react';
import { useTransaction } from '../context/TransactionContext';
import { format } from 'date-fns';
import { Plus, Minus } from 'lucide-react';

const TransactionList = () => {
  const { transactions, deleteTransaction } = useTransaction();

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(Math.abs(amount));
  };

  const formatDate = (dateString) => {
    return format(new Date(dateString), 'MMM dd');
  };

  if (transactions.length === 0) {
    return (
      <div className="transaction-list">
        <h3>Transaction History</h3>
        <div className="empty-state">
          <p>No transactions yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="transaction-list">
      <h3>Transaction History</h3>
      <div className="transactions-list">
        {transactions.slice(0, 10).map(transaction => (
          <div key={transaction.id} className="transaction-item">
            <div className="transaction-icon">
              {transaction.amount > 0 ? (
                <Plus className="icon income-icon" />
              ) : (
                <Minus className="icon expense-icon" />
              )}
            </div>
            
            <div className="transaction-details">
              <div className="transaction-main">
                <span className="transaction-text">{transaction.text}</span>
                <span className="transaction-category">{transaction.category}</span>
              </div>
              <span className="transaction-date">{formatDate(transaction.date)}</span>
            </div>
            
            <div className={`transaction-amount ${transaction.amount > 0 ? 'positive' : 'negative'}`}>
              {transaction.amount > 0 ? '+' : '-'}{formatCurrency(transaction.amount)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransactionList;
