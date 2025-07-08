import React from 'react';
import { useTransaction } from '../context/TransactionContext';
import { Wallet } from 'lucide-react';

const Balance = () => {
  const { balance } = useTransaction();

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="balance-card">
      <div className="card-header">
        <Wallet className="card-icon" />
        <h3>Total Balance</h3>
      </div>
      <div className="balance-amount">
        <span className={`amount ${balance >= 0 ? 'positive' : 'negative'}`}>
          {formatCurrency(balance)}
        </span>
      </div>
    </div>
  );
};

export default Balance;
