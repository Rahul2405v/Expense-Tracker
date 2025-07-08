import React from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const ExpenseChart = ({ transactions }) => {
  const expenseTransactions = transactions.filter(t => t.amount < 0);
  
  if (expenseTransactions.length === 0) {
    return (
      <div className="chart-empty">
        <p>No expense data available for this period</p>
      </div>
    );
  }

  // Group expenses by category
  const categoryData = expenseTransactions.reduce((acc, transaction) => {
    const category = transaction.category;
    acc[category] = (acc[category] || 0) + Math.abs(transaction.amount);
    return acc;
  }, {});

  const data = {
    labels: Object.keys(categoryData),
    datasets: [
      {
        data: Object.values(categoryData),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
          '#FF6384',
          '#C9CBCF'
        ],
        borderWidth: 2,
        borderColor: '#fff'
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const value = new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD'
            }).format(context.parsed);
            return `${context.label}: ${value}`;
          }
        }
      }
    }
  };

  return (
    <div className="chart-container">
      <Pie data={data} options={options} />
    </div>
  );
};

export default ExpenseChart;
