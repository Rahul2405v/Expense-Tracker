import React, { useState } from 'react';
import { useTransaction } from '../context/TransactionContext';
import { X } from 'lucide-react';

const AddTransactionModal = ({ onClose, editTransaction = null }) => {
  const { addTransaction, editTransaction: updateTransaction } = useTransaction();
  
  const [formData, setFormData] = useState({
    text: editTransaction?.text || '',
    amount: editTransaction?.amount ? Math.abs(editTransaction.amount).toString() : '',
    category: editTransaction?.category || '',
    date: editTransaction?.date || new Date().toISOString().split('T')[0],
    type: editTransaction?.type || (editTransaction?.amount > 0 ? 'income' : 'expense') || 'expense'
  });

  const categories = {
    income: ['Salary', 'Freelance', 'Investment', 'Gift', 'Other Income'],
    expense: ['Food', 'Transportation', 'Entertainment', 'Shopping', 'Bills', 'Healthcare', 'Education', 'Other Expense']
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.text.trim() || !formData.amount || !formData.category) {
      alert('Please fill in all fields');
      return;
    }

    const transactionData = {
      ...formData,
      amount: formData.type === 'expense' ? -Math.abs(Number(formData.amount)) : Math.abs(Number(formData.amount))
    };

    if (editTransaction) {
      updateTransaction({ ...transactionData, id: editTransaction.id });
    } else {
      addTransaction(transactionData);
    }
    
    onClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{editTransaction ? 'Edit Transaction' : 'Add New Transaction'}</h2>
          <button className="close-btn" onClick={onClose}>
            <X />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="transaction-form">
          <div className="form-group">
            <label>Transaction Type</label>
            <div className="radio-group">
              <label className="radio-label">
                <input
                  type="radio"
                  name="type"
                  value="income"
                  checked={formData.type === 'income'}
                  onChange={handleChange}
                />
                <span className="radio-custom income"></span>
                Income
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="type"
                  value="expense"
                  checked={formData.type === 'expense'}
                  onChange={handleChange}
                />
                <span className="radio-custom expense"></span>
                Expense
              </label>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="text">Description</label>
            <input
              type="text"
              id="text"
              name="text"
              value={formData.text}
              onChange={handleChange}
              placeholder="Enter description..."
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="amount">Amount</label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="0.00"
              step="0.01"
              min="0"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">Select a category</option>
              {categories[formData.type].map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="date">Date</label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {editTransaction ? 'Update Transaction' : 'Add Transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTransactionModal;
