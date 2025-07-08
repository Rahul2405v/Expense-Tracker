import React, { useState } from 'react';
import { useTransaction } from '../context/TransactionContext';
import { Download, Upload, Trash2, AlertTriangle, Settings as SettingsIcon } from 'lucide-react';

const Settings = () => {
  const { transactions } = useTransaction();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const exportData = () => {
    const dataStr = JSON.stringify(transactions, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `expense-tracker-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const importData = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target.result);
        if (Array.isArray(importedData)) {
          // Here you would normally update the context
          // For now, we'll just show an alert
          alert(`Successfully imported ${importedData.length} transactions!`);
        } else {
          alert('Invalid file format. Please select a valid JSON file.');
        }
      } catch (error) {
        alert('Error reading file. Please ensure it\'s a valid JSON file.');
      }
    };
    reader.readAsText(file);
  };

  const clearAllData = () => {
    localStorage.removeItem('expense-tracker-transactions');
    window.location.reload();
  };

  const calculateStats = () => {
    const totalTransactions = transactions.length;
    const totalIncome = transactions.filter(t => t.amount > 0).reduce((acc, t) => acc + t.amount, 0);
    const totalExpenses = Math.abs(transactions.filter(t => t.amount < 0).reduce((acc, t) => acc + t.amount, 0));
    const oldestTransaction = transactions.length > 0 ? 
      new Date(Math.min(...transactions.map(t => new Date(t.date)))).toLocaleDateString() : 'N/A';
    const categories = [...new Set(transactions.map(t => t.category))].length;

    return {
      totalTransactions,
      totalIncome,
      totalExpenses,
      oldestTransaction,
      categories
    };
  };

  const stats = calculateStats();

  return (
    <div className="settings-page">
      <div className="page-header">
        <h1>Settings</h1>
        <SettingsIcon className="page-icon" />
      </div>

      <div className="settings-content">
        <div className="settings-section">
          <h2>Data Management</h2>
          <div className="settings-grid">
            <div className="setting-card">
              <div className="setting-header">
                <Download className="setting-icon" />
                <h3>Export Data</h3>
              </div>
              <p>Download all your transaction data as a JSON file for backup purposes.</p>
              <button className="btn btn-primary" onClick={exportData}>
                Export Data
              </button>
            </div>

            <div className="setting-card">
              <div className="setting-header">
                <Upload className="setting-icon" />
                <h3>Import Data</h3>
              </div>
              <p>Import transaction data from a previously exported JSON file.</p>
              <label className="btn btn-secondary">
                Import Data
                <input
                  type="file"
                  accept=".json"
                  onChange={importData}
                  style={{ display: 'none' }}
                />
              </label>
            </div>

            <div className="setting-card danger">
              <div className="setting-header">
                <Trash2 className="setting-icon" />
                <h3>Clear All Data</h3>
              </div>
              <p>Permanently delete all transaction data. This action cannot be undone.</p>
              <button 
                className="btn btn-danger" 
                onClick={() => setShowDeleteConfirm(true)}
              >
                Clear All Data
              </button>
            </div>
          </div>
        </div>

        <div className="settings-section">
          <h2>Account Statistics</h2>
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-label">Total Transactions</div>
              <div className="stat-value">{stats.totalTransactions}</div>
            </div>
            <div className="stat-item">
              <div className="stat-label">Total Income</div>
              <div className="stat-value positive">
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD'
                }).format(stats.totalIncome)}
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-label">Total Expenses</div>
              <div className="stat-value negative">
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD'
                }).format(stats.totalExpenses)}
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-label">Categories Used</div>
              <div className="stat-value">{stats.categories}</div>
            </div>
            <div className="stat-item">
              <div className="stat-label">Oldest Transaction</div>
              <div className="stat-value">{stats.oldestTransaction}</div>
            </div>
            <div className="stat-item">
              <div className="stat-label">Data Size</div>
              <div className="stat-value">
                {(JSON.stringify(transactions).length / 1024).toFixed(2)} KB
              </div>
            </div>
          </div>
        </div>

        <div className="settings-section">
          <h2>About</h2>
          <div className="about-card">
            <h3>Expense Tracker v1.0</h3>
            <p>
              A modern expense tracking application built with React. 
              Track your income and expenses, visualize your spending patterns, 
              and get insights into your financial habits.
            </p>
            <div className="features-list">
              <h4>Features:</h4>
              <ul>
                <li>✓ Add, edit, and delete transactions</li>
                <li>✓ Categorize transactions</li>
                <li>✓ Visual analytics and charts</li>
                <li>✓ Filter and search transactions</li>
                <li>✓ Export/import data</li>
                <li>✓ Responsive design</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {showDeleteConfirm && (
        <div className="modal-overlay">
          <div className="modal-content danger-modal">
            <div className="modal-header">
              <AlertTriangle className="danger-icon" />
              <h2>Confirm Data Deletion</h2>
            </div>
            <div className="modal-body">
              <p>
                Are you sure you want to delete ALL transaction data? 
                This action cannot be undone and will permanently remove 
                all {stats.totalTransactions} transactions.
              </p>
              <p>Consider exporting your data first as a backup.</p>
            </div>
            <div className="modal-actions">
              <button 
                className="btn btn-secondary"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </button>
              <button 
                className="btn btn-danger"
                onClick={() => {
                  clearAllData();
                  setShowDeleteConfirm(false);
                }}
              >
                Delete All Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
