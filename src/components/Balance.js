import React from 'react';

export const Balance = ({ balance }) => {
  return (
    <div>
      <h4>Your Balance</h4>
      <h1>${balance}</h1>
    </div>
  );
};
