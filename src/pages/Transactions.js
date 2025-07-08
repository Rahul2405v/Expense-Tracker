import React, { useState } from 'react';
import { useTransaction } from '../context/TransactionContext';
import AddTransactionModal from '../components/AddTransactionModal';
import TransactionFilters from '../components/TransactionFilters';
import TransactionItem from '../components/TransactionItem';
import { Plus, Search } from 'lucide-react';

const Transactions = () => {
  const { transactions } = useTransaction();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    type: 'all',
    dateRange: 'all'
  });

  // Filter transactions based on current filters
  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.text.toLowerCase().includes(filters.search.toLowerCase()) ||
                         transaction.category.toLowerCase().includes(filters.search.toLowerCase());
    
    const matchesCategory = filters.category === 'all' || transaction.category === filters.category;
    
    const matchesType = filters.type === 'all' || 
                       (filters.type === 'income' && transaction.amount > 0) ||
                       (filters.type === 'expense' && transaction.amount < 0);

    let matchesDate = true;
    if (filters.dateRange !== 'all') {
      const transactionDate = new Date(transaction.date);
      const today = new Date();
      
      switch (filters.dateRange) {
        case 'today':
          matchesDate = transactionDate.toDateString() === today.toDateString();
          break;
        case 'week':
          const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
          matchesDate = transactionDate >= weekAgo;
          break;
        case 'month':
          matchesDate = transactionDate.getMonth() === today.getMonth() &&
                       transactionDate.getFullYear() === today.getFullYear();
          break;
        case 'year':
          matchesDate = transactionDate.getFullYear() === today.getFullYear();
          break;
        default:
          matchesDate = true;
      }
    }

    return matchesSearch && matchesCategory && matchesType && matchesDate;
  });

  const handleEditTransaction = (transaction) => {
    setEditingTransaction(transaction);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setEditingTransaction(null);
  };

  return (
    <div className="transactions-page">
      <div className="page-header">
        <h1>Transactions</h1>
        <button 
          className="btn btn-primary"
          onClick={() => setShowAddModal(true)}
        >
          <Plus className="btn-icon" />
          Add Transaction
        </button>
      </div>

      <div className="transactions-content">
        <div className="search-section">
          <div className="search-input-container">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              className="search-input"
            />
          </div>
        </div>

        <TransactionFilters filters={filters} setFilters={setFilters} />

        <div className="transactions-results">
          <div className="results-header">
            <span className="results-count">
              {filteredTransactions.length} transaction{filteredTransactions.length !== 1 ? 's' : ''} found
            </span>
          </div>

          <div className="transactions-list">
            {filteredTransactions.length === 0 ? (
              <div className="empty-state">
                <p>No transactions found matching your criteria.</p>
              </div>
            ) : (
              filteredTransactions.map(transaction => (
                <TransactionItem
                  key={transaction.id}
                  transaction={transaction}
                  onEdit={handleEditTransaction}
                />
              ))
            )}
          </div>
        </div>
      </div>

      {(showAddModal || editingTransaction) && (
        <AddTransactionModal
          editTransaction={editingTransaction}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default Transactions;
