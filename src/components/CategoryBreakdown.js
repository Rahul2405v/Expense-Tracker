import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const CategoryBreakdown = ({ transactions }) => {
  if (transactions.length === 0) {
    return (
      <div className="chart-empty">
        <p>No transaction data available for this period</p>
      </div>
    );
  }

  // Group all transactions by category
  const categoryData = transactions.reduce((acc, transaction) => {
    const category = transaction.category;
    acc[category] = (acc[category] || 0) + Math.abs(transaction.amount);
    return acc;
  }, {});

  // Sort categories by amount
  const sortedCategories = Object.entries(categoryData)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 8); // Top 8 categories

  const data = {
    labels: sortedCategories.map(([category]) => category),
    datasets: [
      {
        data: sortedCategories.map(([, amount]) => amount),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
          '#FF6384',
          '#C9CBCF',
          '#4BC0C0',
          '#36A2EB'
        ],
        borderWidth: 3,
        borderColor: '#fff',
        hoverOffset: 10
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '60%',
    plugins: {
      legend: {
        position: 'right',
        labels: {
          padding: 20,
          usePointStyle: true,
          generateLabels: function(chart) {
            const data = chart.data;
            if (data.labels.length && data.datasets.length) {
              return data.labels.map((label, i) => {
                const value = data.datasets[0].data[i];
                const total = data.datasets[0].data.reduce((acc, val) => acc + val, 0);
                const percentage = ((value / total) * 100).toFixed(1);
                
                return {
                  text: `${label} (${percentage}%)`,
                  fillStyle: data.datasets[0].backgroundColor[i],
                  strokeStyle: data.datasets[0].borderColor,
                  lineWidth: data.datasets[0].borderWidth,
                  hidden: false,
                  index: i
                };
              });
            }
            return [];
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const value = new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD'
            }).format(context.parsed);
            const total = context.dataset.data.reduce((acc, val) => acc + val, 0);
            const percentage = ((context.parsed / total) * 100).toFixed(1);
            return `${context.label}: ${value} (${percentage}%)`;
          }
        }
      }
    }
  };

  const totalAmount = sortedCategories.reduce((acc, [, amount]) => acc + amount, 0);

  return (
    <div className="category-breakdown">
      <div className="chart-container">
        <Doughnut data={data} options={options} />
        <div className="chart-center-text">
          <div className="total-label">Total</div>
          <div className="total-amount">
            {new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD'
            }).format(totalAmount)}
          </div>
        </div>
      </div>
      
      <div className="category-stats">
        <h4>Top Categories</h4>
        <div className="category-list">
          {sortedCategories.map(([category, amount], index) => {
            const percentage = ((amount / totalAmount) * 100).toFixed(1);
            return (
              <div key={category} className="category-stat-item">
                <div 
                  className="category-color" 
                  style={{ backgroundColor: data.datasets[0].backgroundColor[index] }}
                ></div>
                <div className="category-info">
                  <span className="category-name">{category}</span>
                  <span className="category-amount">
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'USD'
                    }).format(amount)} ({percentage}%)
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CategoryBreakdown;
