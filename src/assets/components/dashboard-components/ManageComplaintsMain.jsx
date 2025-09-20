import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Modal } from 'rsuite';
import { API_BASE_URL } from '@/config/api';


const statusOptions = [
  'all', 'open', 'in-progress', 'resolved', 'closed', 'pending'
];

const categoryOptions = [
  'all', 'maintenance', 'security', 'cleaning', 'other'
]; // Add/adjust categories as needed


function ManageComplaintsMain() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editModal, setEditModal] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [users, setUsers] = useState([]);

  // Filtering/search/pagination state
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const complaintsPerPage = 10;


  // Fetch all complaints
  useEffect(() => {
    fetchComplaints();
    fetchUsers();
  }, []);

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/complaint`);
      setComplaints(res.data);
    } catch (err) {
      console.error(err);
      setError('Error fetching complaints');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/users`);
      setUsers(res.data);
    } catch (err) {
        console.error(err);
      /* ignore user fetch error */
    }
  };

  // Delete complaint
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this complaint?')) return;
    setError(''); setSuccess('');
    try {
      await axios.delete(`${API_BASE_URL}/complaint/${id}`);
      setSuccess('Complaint deleted successfully');
      fetchComplaints();
    } catch (err) {
        console.error(err);
        setError('Error deleting complaint');
    }
  };

  // Open edit modal
  const openEditModal = (complaint) => {
    setSelectedComplaint(complaint);
    setEditModal(true);
  };

  // Update complaint (status, assignedTo)
  const handleUpdate = async () => {
    setError(''); setSuccess('');
    try {
      await axios.put(`${API_BASE_URL}/complaint/${selectedComplaint._id}`, {
        status: selectedComplaint.status,
        assignedTo: selectedComplaint.assignedTo?._id || selectedComplaint.assignedTo,
      });
      setSuccess('Complaint updated successfully');
      setEditModal(false);
      fetchComplaints();
    } catch (err) {
        console.error(err);
        setError('Error updating complaint');
    }
  };

  // Assign complaint to user
  const handleAssign = (userId) => {
    setSelectedComplaint({ ...selectedComplaint, assignedTo: userId });
  };

  // Change complaint status
  const handleStatusChange = (status) => {
    setSelectedComplaint({ ...selectedComplaint, status });
  };


  // Filtering, searching, and paginating logic
  const filteredComplaints = complaints.filter(c => {
    const statusMatch = statusFilter === 'all' || c.status === statusFilter;
    const categoryMatch = categoryFilter === 'all' || c.category === categoryFilter;
    const searchMatch = searchTerm === '' ||
      (c.student?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.student?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
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

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow mt-8">
      <h2 className="text-2xl font-bold mb-6 text-blue-900">Manage Complaints</h2>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      {success && <div className="text-green-600 mb-2">{success}</div>}

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
                <th className="px-4 py-2 border border-gray-300 text-left">Student</th>
                <th className="px-4 py-2 border border-gray-300 text-left">Category</th>
                <th className="px-4 py-2 border border-gray-300 text-left">Description</th>
                <th className="px-4 py-2 border border-gray-300 text-left">Status</th>
                <th className="px-4 py-2 border border-gray-300 text-left">Assigned To</th>
                <th className="px-4 py-2 border border-gray-300 text-left">Created</th>
                <th className="px-4 py-2 border border-gray-300 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedComplaints.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-4">No complaints found.</td></tr>
              ) : (
                paginatedComplaints.map(complaint => (
                  <tr key={complaint._id} className="border border-gray-300">
                    <td className="px-4 py-2 border border-gray-300">{complaint.student?.firstName} {complaint.student?.lastName}</td>
                    <td className="px-4 py-2 border border-gray-300 capitalize">{complaint.category}</td>
                    <td className="px-4 py-2 border border-gray-300">{complaint.description}</td>
                    <td className="px-4 py-2 border border-gray-300">
                      <span className={`px-2 py-1 rounded text-xs font-semibold capitalize ${complaint.status === 'resolved' ? 'bg-green-100 text-green-700' : complaint.status === 'in-progress' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-200 text-gray-700'}`}>{complaint.status}</span>
                    </td>
                    <td className="px-4 py-2 border border-gray-300">{complaint.assignedTo ? `${complaint.assignedTo.firstName} ${complaint.assignedTo.lastName}` : '-'}</td>
                    <td className="px-4 py-2 border border-gray-300">{new Date(complaint.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-2 border border-gray-300 flex gap-2">
                      <button className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600" onClick={() => openEditModal(complaint)}>Edit</button>
                      <button className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600" onClick={() => handleDelete(complaint._id)}>Delete</button>
                    </td>
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

      {/* Edit Modal */}
      <Modal open={editModal} onClose={() => setEditModal(false)} size="sm">
        <Modal.Header>
          <Modal.Title>Edit Complaint</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedComplaint && (
            <div className="space-y-4">
              <div>
                <label className="block mb-1 font-medium">Status</label>
                <select
                  className="w-full border rounded px-2 py-1"
                  value={selectedComplaint.status}
                  onChange={e => handleStatusChange(e.target.value)}
                >
                  {statusOptions.filter(s => s !== 'all').map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block mb-1 font-medium">Assign To</label>
                <select
                  className="w-full border rounded px-2 py-1"
                  value={selectedComplaint.assignedTo?._id || selectedComplaint.assignedTo || ''}
                  onChange={e => handleAssign(e.target.value)}
                >
                  <option value="">Unassigned</option>
                  {users.map(user => (
                    <option key={user._id} value={user._id}>{user.firstName} {user.lastName}</option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <button className="bg-blue-600 text-white px-4 py-2 rounded mr-2" onClick={handleUpdate}>Save</button>
          <button className="bg-gray-400 text-white px-4 py-2 rounded" onClick={() => setEditModal(false)}>Cancel</button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ManageComplaintsMain;