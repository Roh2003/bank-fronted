import React, { useState, useEffect } from 'react';

const BankerDashboard = () => {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserTransactions = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('https://bank-backend-c1sy.onrender.com/api/all_transactions', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });

        const data = await res.json();
        if (res.ok) {
          setUsers(data);
          if (data.length > 0) setSelectedUserId(data[0].user_id);
        } else {
          setError(data.message || 'Failed to load data');
        }
      } catch (err) {
        console.error('Error fetching transaction data:', err);
        setError('Error fetching transaction data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserTransactions();
  }, []);

  const selectedUser = users.find(user => user.user_id === selectedUserId);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">Banker Dashboard</h1>

      {loading && <p>Loading data...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && (
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h2 className="text-lg font-medium mb-2">Customers</h2>
            <ul>
              {users.map(user => (
                <li
                  key={user.user_id}
                  onClick={() => setSelectedUserId(user.user_id)}
                  className={`mb-2 border p-2 rounded cursor-pointer hover:bg-gray-100 ${
                    selectedUserId === user.user_id ? 'bg-gray-200' : ''
                  }`}
                >
                  {user.user_name} - Accounts: {user.accounts.length}
                </li>
              ))}
            </ul>
          </div>

          {selectedUser && (
            <div>
              <h2 className="text-lg font-medium mb-2">{selectedUser.user_name}'s Details</h2>
              <div className="mb-4">
                <h3 className="font-semibold">Accounts:</h3>
                <ul>
                  {selectedUser.accounts.map((acc, index) => (
                    <li key={index} className="text-sm">
                      {acc.Account_type} #{acc.Account_number} - Balance: ${acc.Balance}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold">Transaction History:</h3>
                <ul>
                  {selectedUser.transactions.map((txn, index) => (
                    <li key={index} className="text-sm border-b py-1">
                      {txn.type} of ${txn.amount} on {new Date(txn.date).toLocaleString()}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BankerDashboard;
