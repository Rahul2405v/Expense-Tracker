import React from 'react';

export const TransactionList = ({ transactions }) => {
  return (
    <div>
      <h3>History</h3>
      <ul className="list">
        {transactions.map(transaction => (
          <li key={transaction.id} className={transaction.amount < 0 ? 'minus' : 'plus'}>
            {transaction.text} <span>{transaction.amount < 0 ? '-' : '+'}${Math.abs(transaction.amount)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
