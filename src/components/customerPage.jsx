import React, { useState, useEffect } from 'react';
import TransactionModal from './transactionModel.jsx';

const CustomerPage = () => {
  const [balance, setBalance] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('Deposit');
  const [loading, setLoading] = useState(true);

  // Fetch balance when component mounts
  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/customer/account', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
  
        const data = await res.json();
  
        if (res.ok && data && data.Balance !== undefined) {
          setBalance(data.Balance);
        } else {
          alert(data.message || 'Failed to fetch balance');
        }
      } catch (err) {
        console.error('Error:', err);
        alert('Something went wrong while fetching balance');
      } finally {
        setLoading(false);
      }
    };
  
    fetchBalance();
  }, []);
  

  // Submit transaction
  const handleTransaction = async (amount) => {
    try {
      const res = await fetch('http://localhost:5000/api/customer/transaction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ type: modalType, amount })
      });

      const data = await res.json();

      if (res.ok) {
        setBalance(data.newBalance);
        setShowModal(false);
      } else {
        alert(data.message || 'Transaction failed');
      }
    } catch (err) {
      console.error('Transaction error:', err);
      alert('Error while processing transaction');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
      <h1 className="text-2xl font-semibold mb-4">Customer Transactions</h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <p className="mb-4 text-lg">Current Balance: <strong>${balance.toFixed(2)}</strong></p>

          <div className="flex gap-4">
            <button
              onClick={() => { setModalType('Deposit'); setShowModal(true); }}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Deposit
            </button>

            <button
              onClick={() => { setModalType('Withdraw'); setShowModal(true); }}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Withdraw
            </button>
          </div>
        </>
      )}

      {showModal && (
        <TransactionModal
          type={modalType}
          balance={balance}
          onSubmit={handleTransaction}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default CustomerPage;
