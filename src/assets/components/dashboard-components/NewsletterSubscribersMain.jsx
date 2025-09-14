import React, { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { API_BASE_URL } from '../../../config/api';
import {
  FaSpinner, FaEdit, FaTrash, FaEye, FaSearch, FaFilter,
  FaSortAlphaDown, FaSortAlphaUp, FaTimesCircle, FaSave, FaCheckCircle
} from 'react-icons/fa';

const PAGE_SIZE = 10; // Number of subscribers per page

function NewsletterSubscriberMain() {
  const queryClient = useQueryClient();
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editTags, setEditTags] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [viewSubscriber, setViewSubscriber] = useState(null);
  const [localSuccess, setLocalSuccess] = useState(''); // Renamed for consistency
  const [localError, setLocalError] = useState('');     // Renamed for consistency

  // State for Search, Sort, and Pagination
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState(''); // 'Active', 'Unsubscribed', or '' for all
  const [sortConfig, setSortConfig] = useState({ key: 'subscribedAt', direction: 'desc' });
  const [currentPage, setCurrentPage] = useState(1);

  const token = localStorage.getItem('token');

  // Memoized function to get authentication headers
  const getAuthHeaders = useCallback(() => {
    return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
  }, [token]);

  // Fetch all subscribers
  const {
    data: subscribers = [], // Default to empty array
    isLoading,
    isError,
    error,
    refetch // Added refetch for manual data refresh
  } = useQuery({
    queryKey: ['subscribers'],
    queryFn: async () => {
      const res = await axios.get(`${API_BASE_URL}/newsletter/subscribers`, getAuthHeaders());
      return res.data;
    },
    enabled: !!token, // Only enable query if token exists
    staleTime: 5 * 60 * 1000, // Data considered fresh for 5 minutes
    cacheTime: 10 * 60 * 1000, // Data stays in cache for 10 minutes
    onError: (err) => {
      setLocalError(err.response?.data?.error || 'Failed to load subscribers.');
    },
  });

  // Remove subscriber
  const removeMutation = useMutation({
    mutationFn: async (id) => {
      await axios.delete(`${API_BASE_URL}/newsletter/subscribers/${id}`, getAuthHeaders());
    },
    onSuccess: () => {
      setLocalSuccess('Subscriber removed successfully!');
      setLocalError('');
      queryClient.invalidateQueries({ queryKey: ['subscribers'] }); // Invalidate for fresh data
    },
    onError: (err) => {
      setLocalError(err.response?.data?.error || 'Failed to remove subscriber.');
      setLocalSuccess('');
    },
  });

  // Edit subscriber
  const editMutation = useMutation({
    mutationFn: async ({ id, name, tags, notes }) => {
      const res = await axios.put(
        `${API_BASE_URL}/newsletter/subscribers/${id}`,
        { name, tags, notes },
        getAuthHeaders()
      );
      return res.data;
    },
    onSuccess: () => {
      setLocalSuccess('Subscriber updated successfully!');
      setLocalError('');
      setEditId(null); // Exit edit mode
      queryClient.invalidateQueries({ queryKey: ['subscribers'] }); // Invalidate for fresh data
    },
    onError: (err) => {
      setLocalError(err.response?.data?.error || 'Failed to update subscriber.');
      setLocalSuccess('');
    },
  });

  // Effect to clear local success/error messages after a delay
  useEffect(() => {
    if (localSuccess) {
      const timer = setTimeout(() => setLocalSuccess(''), 3000);
      return () => clearTimeout(timer);
    }
    if (localError) {
      const timer = setTimeout(() => setLocalError(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [localSuccess, localError]);

  const handleEdit = (subscriber) => {
    setEditId(subscriber._id);
    setEditName(subscriber.name || '');
    setEditTags(subscriber.tags ? subscriber.tags.join(', ') : '');
    setEditNotes(subscriber.notes || '');
    setLocalSuccess('');
    setLocalError('');
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    editMutation.mutate({
      id: editId,
      name: editName,
      tags: editTags.split(',').map(t => t.trim()).filter(Boolean),
      notes: editNotes,
    });
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Filtering Logic
  const filteredSubscribers = subscribers.filter(subscriber => {
    const matchesSearch =
      subscriber.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subscriber.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subscriber.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = filterStatus === '' ? true :
      (filterStatus === 'Active' && subscriber.isActive) ||
      (filterStatus === 'Unsubscribed' && !subscriber.isActive);

    return matchesSearch && matchesStatus;
  });

  // Sorting Logic
  const sortedSubscribers = [...filteredSubscribers].sort((a, b) => {
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];

    // Handle date sorting
    if (sortConfig.key === 'subscribedAt') {
      const dateA = aValue ? new Date(aValue) : new Date(0); // Use epoch for null dates
      const dateB = bValue ? new Date(bValue) : new Date(0);
      if (dateA < dateB) return sortConfig.direction === 'asc' ? -1 : 1;
      if (dateA > dateB) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    }

    // Handle boolean (isActive) sorting
    if (sortConfig.key === 'isActive') {
      if (aValue === bValue) return 0;
      if (sortConfig.direction === 'asc') {
        return aValue ? -1 : 1; // Active (true) comes before Unsubscribed (false)
      } else {
        return aValue ? 1 : -1; // Unsubscribed (false) comes before Active (true)
      }
    }

    // Handle string/general sorting
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      if (aValue.toLowerCase() < bValue.toLowerCase()) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue.toLowerCase() > bValue.toLowerCase()) return sortConfig.direction === 'asc' ? 1 : -1;
    }

    // Fallback for other types or equal values
    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  // Pagination Logic
  const totalSubscribers = sortedSubscribers.length;
  const totalPages = Math.ceil(totalSubscribers / PAGE_SIZE);
  const paginatedSubscribers = sortedSubscribers.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  // Reset page to 1 when search or filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus]);

  // Loading and Error States
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <FaSpinner className="animate-spin text-blue-500 text-4xl" />
        <p className="ml-3 text-lg text-gray-700">Loading subscribers...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-red-50 text-red-700 p-6 rounded-lg shadow-md m-4">
        <FaTimesCircle className="text-5xl mb-4" />
        <p className="text-xl font-semibold mb-2">Error!</p>
        <p className="text-lg text-center">{error?.message || 'Failed to load subscribers.'}</p>
        <button
          onClick={() => refetch()}
          className="mt-6 px-6 py-3 bg-red-600 text-white font-semibold rounded-md shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition ease-in-out duration-150"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 font-inter antialiased">
      <div className="bg-white rounded-xl shadow-2xl p-6 md:p-8 lg:p-10 border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight">
            Newsletter Subscribers
          </h2>
          <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium shadow-sm">
            Total: {totalSubscribers}
          </span>
        </div>

        {/* Success & Error Messages */}
        {(localSuccess || localError) && (
          <div className={`mb-6 p-4 rounded-lg flex items-center justify-between ${
            localError ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'
          } shadow-sm`}>
            <div className="flex items-center">
              {localError ? <FaTimesCircle className="mr-3 text-xl" /> : <FaCheckCircle className="mr-3 text-xl" />}
              <span className="text-base font-medium">{localError || localSuccess}</span>
            </div>
            <button
              onClick={() => { setLocalError(''); setLocalSuccess(''); }}
              className="text-gray-500 hover:text-gray-700 transition duration-150 ease-in-out"
            >
              <FaTimesCircle size={20} />
            </button>
          </div>
        )}

        {/* Search and Filter Controls */}
        <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by email, name, or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FaFilter className="text-gray-400" />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full md:w-auto pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Unsubscribed">Unsubscribed</option>
            </select>
          </div>
        </div>

        {/* Subscribers Table */}
        <div className="overflow-x-auto rounded-lg shadow-sm border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('email')}
                >
                  <div className="flex items-center">
                    Email
                    {sortConfig.key === 'email' && (
                      sortConfig.direction === 'asc' ? <FaSortAlphaUp className="ml-1" /> : <FaSortAlphaDown className="ml-1" />
                    )}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center">
                    Name
                    {sortConfig.key === 'name' && (
                      sortConfig.direction === 'asc' ? <FaSortAlphaUp className="ml-1" /> : <FaSortAlphaDown className="ml-1" />
                    )}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('isActive')}
                >
                  <div className="flex items-center">
                    Status
                    {sortConfig.key === 'isActive' && (
                      sortConfig.direction === 'asc' ? <FaSortAlphaUp className="ml-1" /> : <FaSortAlphaDown className="ml-1" />
                    )}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('subscribedAt')}
                >
                  <div className="flex items-center">
                    Subscribed At
                    {sortConfig.key === 'subscribedAt' && (
                      sortConfig.direction === 'asc' ? <FaSortAlphaUp className="ml-1" /> : <FaSortAlphaDown className="ml-1" />
                    )}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('tags')}
                >
                  <div className="flex items-center">
                    Tags
                    {sortConfig.key === 'tags' && (
                      sortConfig.direction === 'asc' ? <FaSortAlphaUp className="ml-1" /> : <FaSortAlphaDown className="ml-1" />
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedSubscribers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    No subscribers found matching your criteria.
                  </td>
                </tr>
              ) : (
                paginatedSubscribers.map(subscriber => (
                  <tr key={subscriber._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{subscriber.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{subscriber.name || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        subscriber.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {subscriber.isActive ? 'Active' : 'Unsubscribed'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {subscriber.subscribedAt ? new Date(subscriber.subscribedAt).toLocaleDateString() : '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 max-w-xs truncate">
                      {subscriber.tags?.join(', ') || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                      {editId === subscriber._id ? (
                        <form onSubmit={handleEditSubmit} className="flex flex-col gap-2 p-2 bg-gray-50 rounded-md">
                          <input
                            type="text"
                            value={editName}
                            onChange={e => setEditName(e.target.value)}
                            className="p-2 border border-gray-300 rounded-md text-sm"
                            placeholder="Name"
                          />
                          <input
                            type="text"
                            value={editTags}
                            onChange={e => setEditTags(e.target.value)}
                            className="p-2 border border-gray-300 rounded-md text-sm"
                            placeholder="Tags (comma separated)"
                          />
                          <textarea
                            value={editNotes}
                            onChange={e => setEditNotes(e.target.value)}
                            className="p-2 border border-gray-300 rounded-md text-sm resize-y min-h-[60px]"
                            placeholder="Notes"
                          />
                          <div className="flex justify-end gap-2 mt-2">
                            <button
                              type="submit"
                              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                              disabled={editMutation.isPending}
                            >
                              {editMutation.isPending ? <FaSpinner className="animate-spin mr-1" /> : <FaSave className="mr-1" />} Save
                            </button>
                            <button
                              type="button"
                              className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                              onClick={() => setEditId(null)}
                            >
                              <FaTimesCircle className="mr-1" /> Cancel
                            </button>
                          </div>
                        </form>
                      ) : (
                        <div className="flex justify-center space-x-2">
                          <button
                            className="text-blue-600 hover:text-blue-900"
                            onClick={() => handleEdit(subscriber)}
                            title="Edit Subscriber"
                          >
                            <FaEdit size={18} />
                          </button>
                          <button
                            className="text-red-600 hover:text-red-900"
                            onClick={() => removeMutation.mutate(subscriber._id)}
                            disabled={removeMutation.isPending}
                            title="Remove Subscriber"
                          >
                            {removeMutation.isPending ? <FaSpinner className="animate-spin" /> : <FaTrash size={18} />}
                          </button>
                          <button
                            className="text-gray-600 hover:text-gray-900"
                            onClick={() => setViewSubscriber(subscriber)}
                            title="View Details"
                          >
                            <FaEye size={18} />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {totalSubscribers > 0 && ( // Only show pagination if there are subscribers
          <div className="flex justify-between items-center mt-6">
            <div className="text-sm text-gray-700">
              Showing <span className="font-medium">{(currentPage - 1) * PAGE_SIZE + 1}</span> to{' '}
              <span className="font-medium">
                {Math.min(currentPage * PAGE_SIZE, totalSubscribers)}
              </span>{' '}
              of <span className="font-medium">{totalSubscribers}</span> results
            </div>
            <nav className="flex space-x-1" aria-label="Pagination">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                  currentPage === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNumber => (
                <button
                  key={pageNumber}
                  onClick={() => setCurrentPage(pageNumber)}
                  className={`relative hidden md:inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                    pageNumber === currentPage
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {pageNumber}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                  currentPage === totalPages
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Next
              </button>
            </nav>
          </div>
        )}

        {/* View subscriber details modal */}
        {viewSubscriber && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative">
              <button
                onClick={() => setViewSubscriber(null)}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 transition-colors duration-200"
              >
                <FaTimesCircle size={24} />
              </button>
              <h3 className="text-2xl font-bold text-blue-600 mb-4 border-b pb-2">Subscriber Details</h3>
              <div className="space-y-3 text-gray-700">
                <div><b>Email:</b> <span className="font-medium">{viewSubscriber.email}</span></div>
                <div><b>Name:</b> <span className="font-medium">{viewSubscriber.name || '-'}</span></div>
                <div><b>Status:</b> <span className={`font-medium ${viewSubscriber.isActive ? 'text-green-600' : 'text-red-600'}`}>{viewSubscriber.isActive ? 'Active' : 'Unsubscribed'}</span></div>
                <div><b>Subscribed At:</b> <span className="font-medium">{viewSubscriber.subscribedAt ? new Date(viewSubscriber.subscribedAt).toLocaleString() : '-'}</span></div>
                <div><b>Unsubscribed At:</b> <span className="font-medium">{viewSubscriber.unsubscribedAt ? new Date(viewSubscriber.unsubscribedAt).toLocaleString() : '-'}</span></div>
                <div><b>Tags:</b> <span className="font-medium">{viewSubscriber.tags?.join(', ') || '-'}</span></div>
                <div><b>Notes:</b> <span className="font-medium">{viewSubscriber.notes || '-'}</span></div>
                <div><b>Last Newsletter Sent:</b> <span className="font-medium">{viewSubscriber.lastNewsletterSentAt ? new Date(viewSubscriber.lastNewsletterSentAt).toLocaleString() : '-'}</span></div>
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setViewSubscriber(null)}
                  className="px-5 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors duration-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default NewsletterSubscriberMain;
