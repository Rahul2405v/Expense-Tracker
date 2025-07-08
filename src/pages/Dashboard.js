import React from 'react';
import { useTransaction } from '../context/TransactionContext';
import Balance from '../components/Balance';
import IncomeExpenses from '../components/IncomeExpenses';
import RecentTransactions from '../components/RecentTransactions';
import QuickStats from '../components/QuickStats';
import AddTransactionModal from '../components/AddTransactionModal';
import { Plus } from 'lucide-react';

const Dashboard = () => {
  const { transactions } = useTransaction();
  const [showAddModal, setShowAddModal] = React.useState(false);

  const recentTransactions = transactions.slice(0, 5);

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <button 
          className="btn btn-primary"
          onClick={() => setShowAddModal(true)}
        >
          <Plus className="btn-icon" />
          Add Transaction
        </button>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-section">
          <Balance />
        </div>
        
        <div className="dashboard-section">
          <IncomeExpenses />
        </div>

        <div className="dashboard-section full-width">
          <QuickStats />
        </div>

        <div className="dashboard-section full-width">
          <RecentTransactions transactions={recentTransactions} />
        </div>
      </div>

      {showAddModal && (
        <AddTransactionModal onClose={() => setShowAddModal(false)} />
      )}
    </div>
  );
};

export default Dashboard;
