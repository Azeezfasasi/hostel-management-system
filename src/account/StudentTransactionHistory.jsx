import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '@/config/api';

export default function StudentTransactionHistory() {
  const [transactions, setTransactions] = useState([]);
  useEffect(() => {
    const token = localStorage.getItem("token");
    axios.get(`${API_BASE_URL}/payment`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
      setTransactions(res.data.filter(txn => txn.student?._id === localStorage.getItem("studentId")));
    });
  }, []);
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">My Transactions</h2>
      <ul>
        {transactions.map(txn => (
          <li key={txn._id}>
            {txn.amount} NGN - {txn.status} - {txn.transactionReference}
          </li>
        ))}
      </ul>
    </div>
  );
}
