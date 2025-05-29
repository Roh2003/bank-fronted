import React, { useState, useEffect } from 'react';

const BankerDashboard = () => {
  const [accounts, setAccounts] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAccounts = async () => {

      setLoading(true);
      setError(null);
      try {
        const res = await fetch('http://localhost:5000/api/banker/accounts', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });

        const data = await res.json();
        console.log('Fetched accounts data:', data);

        if (res.ok) {
          if (Array.isArray(data.accounts)) {
            setAccounts(data.accounts);
            if (data.accounts.length > 0) {
              setSelectedUserId(data.accounts[0].user_id); 
            }
          } else {
            // data.accounts missing or invalid
            setAccounts([]);
            setError('No accounts data available');
          }
        } else {
          setError(data.message || 'Failed to load accounts');
          setAccounts([]);
        }
      } catch (err) {
        console.error('Error fetching accounts:', err);
        setError('Error fetching accounts');
        setAccounts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, []);

  // Group accounts by user_id
  const groupedAccounts = accounts.reduce((acc, account) => {
    if (!acc[account.user_id]) acc[account.user_id] = [];
    acc[account.user_id].push(account);
    return acc;
  }, {});

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">Banker Dashboard</h1>

      {loading && <p>Loading accounts...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && (
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h2 className="text-lg font-medium mb-2">Customer Accounts</h2>
            {Object.keys(groupedAccounts).length === 0 ? (
              <p>No customer accounts found.</p>
            ) : (
              <ul>
                {Object.entries(groupedAccounts).map(([userId, userAccounts]) => (
                  <li
                    key={userId}
                    className={`mb-2 border p-2 rounded cursor-pointer hover:bg-gray-100 ${
                      selectedUserId === Number(userId) ? 'bg-gray-200' : ''
                    }`}
                    onClick={() => setSelectedUserId(Number(userId))}
                  >
                    {userAccounts[0].user_name} - Total Accounts: {userAccounts.length}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {selectedUserId && groupedAccounts[selectedUserId] && (
            <div>
              <h2 className="text-lg font-medium mb-2">
                Accounts for {groupedAccounts[selectedUserId][0].user_name}
              </h2>
              <ul>
                {groupedAccounts[selectedUserId].map((acc) => (
                  <li key={acc.id} className="border-b py-1">
                    {acc.Account_type} - #{acc.Account_number} - Balance: ${acc.Balance}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BankerDashboard;
