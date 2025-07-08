import React from 'react';
import { useTransaction } from '../context/TransactionContext';
import { format } from 'date-fns';
import { Edit, Trash2, Plus, Minus } from 'lucide-react';

const TransactionItem = ({ transaction, onEdit }) => {
  const { deleteTransaction } = useTransaction();

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(Math.abs(amount));
  };

  const formatDate = (dateString) => {
    return format(new Date(dateString), 'MMM dd, yyyy');
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      deleteTransaction(transaction.id);
    }
  };

  return (
    <div className="transaction-item-detailed">
      <div className="transaction-icon">
        {transaction.amount > 0 ? (
          <Plus className="icon income-icon" />
        ) : (
          <Minus className="icon expense-icon" />
        )}
      </div>

      <div className="transaction-content">
        <div className="transaction-main-info">
          <h4 className="transaction-text">{transaction.text}</h4>
          <span className="transaction-category">{transaction.category}</span>
        </div>
        <div className="transaction-meta">
          <span className="transaction-date">{formatDate(transaction.date)}</span>
        </div>
      </div>

      <div className="transaction-amount-section">
        <div className={`transaction-amount ${transaction.amount > 0 ? 'positive' : 'negative'}`}>
          {transaction.amount > 0 ? '+' : '-'}{formatCurrency(transaction.amount)}
        </div>
      </div>

      <div className="transaction-actions">
        <button
          className="action-btn edit-btn"
          onClick={() => onEdit(transaction)}
          title="Edit transaction"
        >
          <Edit className="action-icon" />
        </button>
        <button
          className="action-btn delete-btn"
          onClick={handleDelete}
          title="Delete transaction"
        >
          <Trash2 className="action-icon" />
        </button>
      </div>
    </div>
  );
};

export default TransactionItem;
