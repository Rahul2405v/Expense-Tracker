import React, { useState } from 'react';
import './App.css';
import { Balance } from './components/Balance';
import { IncomeExpenses } from './components/IncomeExpenses';
import { TransactionList } from './components/TransactionList';
import { AddTransaction } from './components/AddTransaction';

function App() {
  const [transactions, setTransactions] = useState([
    { id: 1, text: 'Cash', amount: 500 },
    
  ]);

  const addTransaction = (transaction) => {
    setTransactions([...transactions, transaction]);
  };

  const amounts = transactions.map(transaction => transaction.amount);
  const balance = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);
  const income = amounts.filter(item => item > 0).reduce((acc, item) => (acc += item), 0).toFixed(2);
  const expense = (amounts.filter(item => item < 0).reduce((acc, item) => (acc += item), 0) * -1).toFixed(2);

  return (
    <div>
      <h2>Expense Tracker</h2>
      <div className="container">
        <Balance balance={balance} />
        <IncomeExpenses income={income} expense={expense} />
        <TransactionList transactions={transactions} />
        <AddTransaction addTransaction={addTransaction} />
      </div>
    </div>
  );
}

export default App;
