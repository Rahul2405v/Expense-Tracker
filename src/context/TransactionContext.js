import React, { createContext, useContext, useReducer, useEffect } from 'react';

const TransactionContext = createContext();

// Transaction Actions
const ADD_TRANSACTION = 'ADD_TRANSACTION';
const DELETE_TRANSACTION = 'DELETE_TRANSACTION';
const EDIT_TRANSACTION = 'EDIT_TRANSACTION';
const SET_TRANSACTIONS = 'SET_TRANSACTIONS';

// Reducer
const transactionReducer = (state, action) => {
  switch (action.type) {
    case ADD_TRANSACTION:
      return {
        ...state,
        transactions: [action.payload, ...state.transactions]
      };
    case DELETE_TRANSACTION:
      return {
        ...state,
        transactions: state.transactions.filter(transaction => transaction.id !== action.payload)
      };
    case EDIT_TRANSACTION:
      return {
        ...state,
        transactions: state.transactions.map(transaction =>
          transaction.id === action.payload.id ? action.payload : transaction
        )
      };
    case SET_TRANSACTIONS:
      return {
        ...state,
        transactions: action.payload
      };
    default:
      return state;
  }
};

// Sample data
const initialTransactions = [
  { id: 1, text: 'Salary', amount: 3000, category: 'Income', date: '2024-01-15', type: 'income' },
  { id: 2, text: 'Groceries', amount: -120, category: 'Food', date: '2024-01-14', type: 'expense' },
  { id: 3, text: 'Gas', amount: -45, category: 'Transportation', date: '2024-01-13', type: 'expense' },
  { id: 4, text: 'Freelance', amount: 500, category: 'Income', date: '2024-01-12', type: 'income' },
  { id: 5, text: 'Coffee', amount: -8, category: 'Food', date: '2024-01-11', type: 'expense' },
];

const initialState = {
  transactions: initialTransactions
};

export const TransactionProvider = ({ children }) => {
  const [state, dispatch] = useReducer(transactionReducer, initialState);

  // Load transactions from localStorage on mount
  useEffect(() => {
    const savedTransactions = localStorage.getItem('expense-tracker-transactions');
    if (savedTransactions) {
      dispatch({ type: SET_TRANSACTIONS, payload: JSON.parse(savedTransactions) });
    }
  }, []);

  // Save transactions to localStorage whenever transactions change
  useEffect(() => {
    localStorage.setItem('expense-tracker-transactions', JSON.stringify(state.transactions));
  }, [state.transactions]);

  const addTransaction = (transaction) => {
    const newTransaction = {
      ...transaction,
      id: Date.now(),
      date: transaction.date || new Date().toISOString().split('T')[0]
    };
    dispatch({ type: ADD_TRANSACTION, payload: newTransaction });
  };

  const deleteTransaction = (id) => {
    dispatch({ type: DELETE_TRANSACTION, payload: id });
  };

  const editTransaction = (transaction) => {
    dispatch({ type: EDIT_TRANSACTION, payload: transaction });
  };

  // Calculate totals
  const amounts = state.transactions.map(transaction => transaction.amount);
  const balance = amounts.reduce((acc, item) => acc + item, 0);
  const income = amounts.filter(item => item > 0).reduce((acc, item) => acc + item, 0);
  const expense = amounts.filter(item => item < 0).reduce((acc, item) => acc + item, 0);

  const value = {
    transactions: state.transactions,
    addTransaction,
    deleteTransaction,
    editTransaction,
    balance,
    income,
    expense: Math.abs(expense)
  };

  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransaction = () => {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error('useTransaction must be used within a TransactionProvider');
  }
  return context;
};
