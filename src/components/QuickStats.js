import React from 'react';
import { useTransaction } from '../context/TransactionContext';
import { Calendar, Target, TrendingUp, Activity } from 'lucide-react';

const QuickStats = () => {
  const { transactions } = useTransaction();

  // Calculate monthly stats
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const monthlyTransactions = transactions.filter(transaction => {
    const transactionDate = new Date(transaction.date);
    return transactionDate.getMonth() === currentMonth && 
           transactionDate.getFullYear() === currentYear;
  });

  const monthlyIncome = monthlyTransactions
    .filter(t => t.amount > 0)
    .reduce((acc, t) => acc + t.amount, 0);
    
  const monthlyExpenses = Math.abs(monthlyTransactions
    .filter(t => t.amount < 0)
    .reduce((acc, t) => acc + t.amount, 0));

  const avgTransactionValue = transactions.length > 0 
    ? Math.abs(transactions.reduce((acc, t) => acc + Math.abs(t.amount), 0) / transactions.length)
    : 0;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const stats = [
    {
      icon: Calendar,
      label: 'This Month Income',
      value: formatCurrency(monthlyIncome),
      color: 'green'
    },
    {
      icon: Target,
      label: 'This Month Expenses',
      value: formatCurrency(monthlyExpenses),
      color: 'red'
    },
    {
      icon: Activity,
      label: 'Avg. Transaction',
      value: formatCurrency(avgTransactionValue),
      color: 'blue'
    },
    {
      icon: TrendingUp,
      label: 'Total Transactions',
      value: transactions.length.toString(),
      color: 'purple'
    }
  ];

  return (
    <div className="quick-stats">
      <h3 className="section-title">Quick Stats</h3>
      <div className="stats-grid">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="stat-card">
              <div className={`stat-icon ${stat.color}`}>
                <Icon />
              </div>
              <div className="stat-content">
                <span className="stat-label">{stat.label}</span>
                <span className="stat-value">{stat.value}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default QuickStats;
