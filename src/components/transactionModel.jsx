import React, { useState } from 'react';

const TransactionModal = ({ type, balance, onSubmit, onClose }) => {
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) return;

    if (type === 'Withdraw' && numAmount > balance) {
      setError('Insufficient Funds');
    } else {
      setError('');
      onSubmit(numAmount);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-md w-80">
        <h2 className="text-xl font-semibold mb-4">{type}</h2>
        <p className="mb-2">Available Balance: ${balance.toFixed(2)}</p>
        <input
          type="number"
          className="w-full border rounded p-2 mb-2"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
        />
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="bg-gray-300 px-4 py-1 rounded">Cancel</button>
          <button onClick={handleSubmit} className="bg-blue-600 text-white px-4 py-1 rounded">
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionModal;