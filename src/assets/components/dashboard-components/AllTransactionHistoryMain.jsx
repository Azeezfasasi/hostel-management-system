
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '@/config/api';

const statusOptions = [
  'all', 'pending', 'completed', 'failed', 'refunded'
];
const typeOptions = [
  'all', 'payment', 'refund', 'deposit', 'withdrawal'
];

export default function AllTransactionHistoryMain() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const transactionsPerPage = 10;

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`${API_BASE_URL}/transaction`);
      setTransactions(res.data);
    } catch (err) {
      console.error(err);
      setError('Error fetching transactions');
    } finally {
      setLoading(false);
    }
  };

  // Filtering, searching, and paginating logic
  const filteredTransactions = transactions.filter(t => {
    const statusMatch = statusFilter === 'all' || t.status === statusFilter;
    const typeMatch = typeFilter === 'all' || t.type === typeFilter;
    const searchMatch = searchTerm === '' ||
      (t.student?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.student?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.reference?.toLowerCase().includes(searchTerm.toLowerCase()));
    return statusMatch && typeMatch && searchMatch;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredTransactions.length / transactionsPerPage);
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * transactionsPerPage,
    currentPage * transactionsPerPage
  );

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Reset to first page when filters/search change
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, typeFilter, searchTerm]);

  // Status badge color
  const getStatusClass = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'failed': return 'bg-red-100 text-red-700';
      case 'refunded': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-200 text-gray-700';
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow mt-8">
      <h2 className="text-2xl font-bold mb-6 text-blue-900">All Transaction History</h2>
      {error && <div className="text-red-600 mb-2">{error}</div>}

      {/* Filters and search */}
      <div className="flex flex-wrap gap-4 mb-4 items-center">
        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <select
            className="border rounded px-2 py-1"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          >
            {statusOptions.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Type</label>
          <select
            className="border rounded px-2 py-1"
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
          >
            {typeOptions.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col">
          <label className="block text-sm font-medium mb-1">Search</label>
          <input
            type="text"
            className="border rounded px-2 py-1"
            placeholder="Search by student or reference..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div>Loading transactions...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 rounded">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 border border-gray-300 text-left">Student</th>
                <th className="px-4 py-2 border border-gray-300 text-left">Type</th>
                <th className="px-4 py-2 border border-gray-300 text-left">Amount</th>
                <th className="px-4 py-2 border border-gray-300 text-left">Status</th>
                <th className="px-4 py-2 border border-gray-300 text-left">Reference</th>
                <th className="px-4 py-2 border border-gray-300 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {paginatedTransactions.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-4">No transactions found.</td></tr>
              ) : (
                paginatedTransactions.map(tx => (
                  <tr key={tx._id} className="border border-gray-300">
                    <td className="px-4 py-2 border border-gray-300">{tx.student ? `${tx.student.firstName} ${tx.student.lastName}` : '-'}</td>
                    <td className="px-4 py-2 border border-gray-300">{tx.type}</td>
                    <td className="px-4 py-2 border border-gray-300">₦{tx.amount?.toLocaleString()}</td>
                    <td className="px-4 py-2 border border-gray-300">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusClass(tx.status)}`}>{tx.status}</span>
                    </td>
                    <td className="px-4 py-2 border border-gray-300">{tx.reference || '-'}</td>
                    <td className="px-4 py-2 border border-gray-300">{new Date(tx.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Pagination controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-4">
              <button
                className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
              >Prev</button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  className={`px-3 py-1 rounded ${page === currentPage ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
                  onClick={() => handlePageChange(page)}
                >{page}</button>
              ))}
              <button
                className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
              >Next</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
