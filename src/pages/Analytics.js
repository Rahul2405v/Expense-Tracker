import React, { useState } from 'react';
import { useTransaction } from '../context/TransactionContext';
import ExpenseChart from '../components/ExpenseChart';
import IncomeExpenseChart from '../components/IncomeExpenseChart';
import CategoryBreakdown from '../components/CategoryBreakdown';
import MonthlyTrends from '../components/MonthlyTrends';
import { Calendar, TrendingUp, PieChart, BarChart3 } from 'lucide-react';

const Analytics = () => {
  const { transactions } = useTransaction();
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Calculate analytics data based on selected period
  const getAnalyticsData = () => {
    const now = new Date();
    let filteredTransactions = transactions;

    switch (selectedPeriod) {
      case 'week':
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        filteredTransactions = transactions.filter(t => new Date(t.date) >= weekAgo);
        break;
      case 'month':
        filteredTransactions = transactions.filter(t => {
          const tDate = new Date(t.date);
          return tDate.getMonth() === now.getMonth() && tDate.getFullYear() === now.getFullYear();
        });
        break;
      case 'year':
        filteredTransactions = transactions.filter(t => {
          const tDate = new Date(t.date);
          return tDate.getFullYear() === now.getFullYear();
        });
        break;
      default:
        filteredTransactions = transactions;
    }

    return filteredTransactions;
  };

  const analyticsData = getAnalyticsData();
  const periodIncome = analyticsData.filter(t => t.amount > 0).reduce((acc, t) => acc + t.amount, 0);
  const periodExpense = Math.abs(analyticsData.filter(t => t.amount < 0).reduce((acc, t) => acc + t.amount, 0));

  return (
    <div className="analytics-page">
      <div className="page-header">
        <h1>Analytics & Reports</h1>
        <div className="period-selector">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="period-select"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
            <option value="all">All Time</option>
          </select>
        </div>
      </div>

      <div className="analytics-overview">
        <div className="overview-card">
          <div className="card-header">
            <TrendingUp className="card-icon positive" />
            <h3>Period Income</h3>
          </div>
          <div className="card-value positive">{formatCurrency(periodIncome)}</div>
        </div>

        <div className="overview-card">
          <div className="card-header">
            <TrendingUp className="card-icon negative" />
            <h3>Period Expenses</h3>
          </div>
          <div className="card-value negative">{formatCurrency(periodExpense)}</div>
        </div>

        <div className="overview-card">
          <div className="card-header">
            <BarChart3 className="card-icon neutral" />
            <h3>Net Income</h3>
          </div>
          <div className={`card-value ${(periodIncome - periodExpense) >= 0 ? 'positive' : 'negative'}`}>
            {formatCurrency(periodIncome - periodExpense)}
          </div>
        </div>

        <div className="overview-card">
          <div className="card-header">
            <Calendar className="card-icon neutral" />
            <h3>Transactions</h3>
          </div>
          <div className="card-value neutral">{analyticsData.length}</div>
        </div>
      </div>

      <div className="analytics-charts">
        <div className="chart-section">
          <div className="chart-card">
            <h3 className="chart-title">
              <PieChart className="chart-icon" />
              Expense Breakdown
            </h3>
            <ExpenseChart transactions={analyticsData} />
          </div>
        </div>

        <div className="chart-section">
          <div className="chart-card">
            <h3 className="chart-title">
              <BarChart3 className="chart-icon" />
              Income vs Expenses
            </h3>
            <IncomeExpenseChart transactions={analyticsData} />
          </div>
        </div>

        <div className="chart-section full-width">
          <div className="chart-card">
            <h3 className="chart-title">
              <TrendingUp className="chart-icon" />
              Monthly Trends
            </h3>
            <MonthlyTrends transactions={transactions} />
          </div>
        </div>

        <div className="chart-section full-width">
          <div className="chart-card">
            <h3 className="chart-title">
              <PieChart className="chart-icon" />
              Category Breakdown
            </h3>
            <CategoryBreakdown transactions={analyticsData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
