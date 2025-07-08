import React from 'react';
import { Filter } from 'lucide-react';

const TransactionFilters = ({ filters, setFilters }) => {
  const categories = [
    'Salary', 'Freelance', 'Investment', 'Gift', 'Food', 'Transportation', 
    'Entertainment', 'Shopping', 'Bills', 'Healthcare', 'Education', 'Other Income', 'Other Expense'
  ];

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  return (
    <div className="transaction-filters">
      <div className="filters-header">
        <Filter className="filter-icon" />
        <span>Filters</span>
      </div>

      <div className="filters-grid">
        <div className="filter-group">
          <label>Category</label>
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Type</label>
          <select
            value={filters.type}
            onChange={(e) => handleFilterChange('type', e.target.value)}
          >
            <option value="all">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Date Range</label>
          <select
            value={filters.dateRange}
            onChange={(e) => handleFilterChange('dateRange', e.target.value)}
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
        </div>

        <div className="filter-group">
          <button
            className="btn btn-secondary"
            onClick={() => setFilters({
              search: '',
              category: 'all',
              type: 'all',
              dateRange: 'all'
            })}
          >
            Clear Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionFilters;
