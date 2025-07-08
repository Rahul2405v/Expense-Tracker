import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { ArrowRight, Plus, Minus } from 'lucide-react';

const RecentTransactions = ({ transactions }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(Math.abs(amount));
  };

  const formatDate = (dateString) => {
    return format(new Date(dateString), 'MMM dd, yyyy');
  };

  if (transactions.length === 0) {
    return (
      <div className="recent-transactions">
        <h3 className="section-title">Recent Transactions</h3>
        <div className="empty-state">
          <p>No transactions yet. Start by adding your first transaction!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="recent-transactions">
      <div className="section-header">
        <h3 className="section-title">Recent Transactions</h3>
        <Link to="/transactions" className="view-all-link">
          View All <ArrowRight className="link-icon" />
        </Link>
      </div>
      
      <div className="transactions-list">
        {transactions.map((transaction) => (
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

export default RecentTransactions;
