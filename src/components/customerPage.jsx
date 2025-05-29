import React, { useState, useEffect } from 'react';
import TransactionModal from './transactionModel.jsx';
import { toast, ToastContainer } from 'react-toastify';

const CustomerPage = () => {
  const [balance, setBalance] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('Deposit');
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);

  const fetchBalance = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/customer/account', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await res.json();

      if (res.ok && data && typeof data.Balance === 'number') {
        setBalance(data.Balance);
      } else {
        toast.error(data.message || 'Failed to fetch balance');
      }
    } catch (err) {
      console.error('Error:', err);
      toast.error("Something went wrong while fetching balance");
    }
  };

  const fetchTransactions = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/customer/transaction/fetch', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await res.json();

      if (res.ok) {
        setTransactions(data);
      } else {
        toast.error(data.message || 'Failed to fetch transactions');
      }
    } catch (err) {
      console.error('Fetch transactions error:', err);
      toast.error("Something went wrong while fetching transactions");
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await fetchBalance();
      await fetchTransactions();
      toast.success("Welcome to Enpointe Banking Service!", {
        toastId: 'welcome-toast'
      });
      setLoading(false);
    };

    init();
  }, []);

  const handleTransaction = async (amount) => {
    if (!amount || isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/customer/transaction/add', {
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
        toast.success(`${modalType} successful! New balance: $${data.newBalance.toFixed(2)}`);
        fetchTransactions(); // ✅ Refresh transaction history after transaction
      } else {
        toast.error(data.message || 'Transaction failed');
      }
    } catch (err) {
      console.error('Transaction error:', err);
      toast.error('Error while processing transaction');
    }
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen p-6 bg-gray-50">
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar={false} theme="light" />

      <h1 className="text-2xl font-semibold mb-4">Customer Transactions</h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <p className="mb-4 text-lg">Current Balance: <strong>${balance.toFixed(2)}</strong></p>

          <div className="flex gap-4 mb-6">
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

          {/* Transaction History */}
          <div className="w-full max-w-md bg-white rounded shadow p-4">
            <h2 className="text-lg font-semibold mb-2">Transaction History</h2>
            {transactions.length === 0 ? (
              <p className="text-gray-500">No transactions yet.</p>
            ) : (
              <ul className="space-y-2">
                {transactions.map((txn, index) => (
                  <li key={index} className="flex justify-between items-center border-b pb-1 text-sm">
                    <span className={`font-medium ${txn.type === 'Deposit' ? 'text-green-600' : 'text-red-500'}`}>
                      {txn.type}
                    </span>
                    <span>${txn.amount.toFixed(2)}</span>
                    <span className="text-gray-500 text-xs">{new Date(txn.date).toLocaleString()}</span>
                  </li>
                ))}
              </ul>
            )}
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
