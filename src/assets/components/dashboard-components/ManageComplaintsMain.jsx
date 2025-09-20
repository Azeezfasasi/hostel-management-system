import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Modal } from 'rsuite';
import { API_BASE_URL } from '@/config/api';

const statusOptions = [
  'open', 'in-progress', 'resolved', 'closed', 'pending'
];

function ManageComplaintsMain() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editModal, setEditModal] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [users, setUsers] = useState([]);

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

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow mt-8">
      <h2 className="text-2xl font-bold mb-6 text-blue-900">Manage Complaints</h2>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      {success && <div className="text-green-600 mb-2">{success}</div>}
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
              {complaints.map(complaint => (
                <tr key={complaint._id} className="border border-gray-300">
                  <td className="px-4 py-2 border border-gray-300">{complaint.student?.firstName} {complaint.student?.lastName}</td>
                  <td className="px-4 py-2 border border-gray-300">{complaint.category}</td>
                  <td className="px-4 py-2 border border-gray-300">{complaint.description}</td>
                  <td className="px-4 py-2 border border-gray-300">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${complaint.status === 'resolved' ? 'bg-green-100 text-green-700' : complaint.status === 'in-progress' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-200 text-gray-700'}`}>{complaint.status}</span>
                  </td>
                  <td className="px-4 py-2 border border-gray-300">{complaint.assignedTo ? `${complaint.assignedTo.firstName} ${complaint.assignedTo.lastName}` : '-'}</td>
                  <td className="px-4 py-2 border border-gray-300">{new Date(complaint.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-2 border border-gray-300 flex gap-2">
                    <button className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600" onClick={() => openEditModal(complaint)}>Edit</button>
                    <button className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600" onClick={() => handleDelete(complaint._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
                  {statusOptions.map(status => (
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