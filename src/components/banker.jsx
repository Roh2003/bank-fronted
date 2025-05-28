import React, { useState, useEffect } from 'react';

const BankerDashboard = () => {
  const [accounts, setAccounts] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/customer/account', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
  
        const data = await res.json();
        if (res.ok) {
          // Admin gets { accounts: [...] }, customer gets a single account
          if (Array.isArray(data.accounts)) {
            setAccounts(data.accounts);
          } else {
            // fallback for customer view
            setAccounts([data]);
          }
        } else {
          console.error(data.message);
        }
      } catch (error) {
        console.error('Error fetching accounts:', error);
      }
    };
  
    fetchAccounts();
  }, []);
  
  

   

  const groupedTransactions = accounts.reduce((acc, account) => {
    if (!acc[account.user_id]) acc[account.user_id] = [];
    acc[account.user_id].push(account);
    return acc;
  }, {});

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">Banker Dashboard</h1>
      <div className="grid grid-cols-2 gap-6">
        <div>
          <h2 className="text-lg font-medium mb-2">Customer Accounts</h2>
          <ul>
            {Object.values(groupedTransactions).map((userAccounts, index) => (
              <li key={index} className="mb-2 border p-2 rounded cursor-pointer hover:bg-gray-100"
                  onClick={() => setSelectedUserId(userAccounts[0].user_id)}>
                {userAccounts[0].user_name} - Total Accounts: {userAccounts.length}
              </li>
            ))}
          </ul>
        </div>
        {selectedUserId && (
          <div>
            <h2 className="text-lg font-medium mb-2">
              Accounts for {
                groupedTransactions[selectedUserId][0].user_name
              }
            </h2>
            <ul>
              {groupedTransactions[selectedUserId].map(acc => (
                <li key={acc.id} className="border-b py-1">
                  {acc.Account_type} - #{acc.Account_number} - Balance: ${acc.Balance}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default BankerDashboard;
