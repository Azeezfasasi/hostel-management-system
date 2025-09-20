
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '@/config/api';

const statusOptions = [
  'all', 'open', 'in-progress', 'resolved', 'closed', 'pending'
];
const categoryOptions = [
  'all', 'maintenance', 'electricity', 'security', 'other'
];

// Replace with actual student ID from auth context or props
const getStudentId = () => {
  // TODO: Replace with real logic
  return localStorage.getItem('studentId');
};

export default function MyComplaintsMain() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const complaintsPerPage = 10;

  useEffect(() => {
    fetchComplaints();
    // eslint-disable-next-line
  }, []);

  const fetchComplaints = async () => {
    setLoading(true);
    setError('');
    try {
      const studentId = getStudentId();
      if (!studentId) {
        setError('Student not logged in.');
        setLoading(false);
        return;
      }
      const res = await axios.get(`${API_BASE_URL}/complaint/student/${studentId}`);
      setComplaints(res.data);
    } catch (err) {
        console.error(err);
        setError('Error fetching complaints');
    } finally {
      setLoading(false);
    }
  };

  // Filtering, searching, and paginating logic
  const filteredComplaints = complaints.filter(c => {
    const statusMatch = statusFilter === 'all' || c.status === statusFilter;
    const categoryMatch = categoryFilter === 'all' || c.category === categoryFilter;
    const searchMatch = searchTerm === '' ||
      (c.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.category?.toLowerCase().includes(searchTerm.toLowerCase()));
    return statusMatch && categoryMatch && searchMatch;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredComplaints.length / complaintsPerPage);
  const paginatedComplaints = filteredComplaints.slice(
    (currentPage - 1) * complaintsPerPage,
    currentPage * complaintsPerPage
  );

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Reset to first page when filters/search change
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, categoryFilter, searchTerm]);

  // Status badge color
  const getStatusClass = (status) => {
    switch (status) {
      case 'resolved': return 'bg-green-100 text-green-700';
      case 'in-progress': return 'bg-yellow-100 text-yellow-700';
      case 'open': return 'bg-blue-100 text-blue-700';
      case 'closed': return 'bg-gray-300 text-gray-700';
      case 'pending': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-200 text-gray-700';
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-lg shadow mt-8">
      <h2 className="text-2xl font-bold mb-6 text-blue-900">My Complaints</h2>
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
              <option key={status} value={status} className='capitalize'>{status}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <select
            className="border rounded px-2 py-1"
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
          >
            {categoryOptions.map(category => (
              <option key={category} value={category} className='capitalize'>{category}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col">
          <label className="block text-sm font-medium mb-1">Search</label>
          <input
            type="text"
            className="border rounded px-2 py-1"
            placeholder="Search complaints..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div>Loading complaints...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 rounded">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 border border-gray-300 text-left">Category</th>
                <th className="px-4 py-2 border border-gray-300 text-left">Description</th>
                <th className="px-4 py-2 border border-gray-300 text-left">Status</th>
                <th className="px-4 py-2 border border-gray-300 text-left">Assigned Staff</th>
                <th className="px-4 py-2 border border-gray-300 text-left">Created</th>
              </tr>
            </thead>
            <tbody>
              {paginatedComplaints.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-4">No complaints found.</td></tr>
              ) : (
                paginatedComplaints.map(complaint => (
                  <tr key={complaint._id} className="border border-gray-300">
                    <td className="px-4 py-2 border border-gray-300 capitalize">{complaint.category}</td>
                    <td className="px-4 py-2 border border-gray-300">{complaint.description}</td>
                    <td className="px-4 py-2 border border-gray-300">
                      <span className={`px-2 py-1 rounded text-xs font-semibold capitalize ${getStatusClass(complaint.status)}`}>{complaint.status}</span>
                    </td>
                    <td className="px-4 py-2 border border-gray-300">{complaint.assignedTo ? `${complaint.assignedTo.firstName} ${complaint.assignedTo.lastName}` : '-'}</td>
                    <td className="px-4 py-2 border border-gray-300">{new Date(complaint.createdAt).toLocaleDateString()}</td>
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
