import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '@/config/api';


function ManageStudentsMain() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 10;

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    setMessage('');
    try {
      const token = localStorage.getItem('token');
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      const res = await axios.get(`${API_BASE_URL}/users`, config);
      setStudents((res.data || []).filter(u => u.role === 'student'));
    } catch (err) {
      console.log(err);
      setMessage('Failed to fetch students');
    }
    setLoading(false);
  };

  const handleEdit = (student) => {
    setEditId(student._id);
    setEditData({ ...student });
  };

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleEditSave = async () => {
    setMessage('');
    try {
      const token = localStorage.getItem('token');
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      await axios.put(`${API_BASE_URL}/users/${editId}`, editData, config);
      setMessage('Student updated successfully');
      setEditId(null);
      fetchStudents();
    } catch (err) {
      setMessage(err.response?.data?.error || 'Failed to update student');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this student?')) return;
    setMessage('');
    try {
      const token = localStorage.getItem('token');
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      await axios.delete(`${API_BASE_URL}/users/${id}`, config);
      setMessage('Student deleted successfully');
      fetchStudents();
    } catch (err) {
      setMessage(err.response?.data?.error || 'Failed to delete student');
    }
  };

  const handleDisable = async (id) => {
    if (!window.confirm('Disable this student?')) return;
    setMessage('');
    try {
      const token = localStorage.getItem('token');
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      await axios.patch(`${API_BASE_URL}/users/${id}/disable`, {}, config);
      setMessage('Student disabled successfully');
      fetchStudents();
    } catch (err) {
      setMessage(err.response?.data?.error || 'Failed to disable student');
    }
  };

  const handleEnable = async (id) => {
    if (!window.confirm('Enable this student?')) return;
    setMessage('');
    try {
      const token = localStorage.getItem('token');
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      await axios.patch(`${API_BASE_URL}/users/${id}/enable`, {}, config);
      setMessage('Student enabled successfully');
      fetchStudents();
    } catch (err) {
      setMessage(err.response?.data?.error || 'Failed to enable student');
    }
  };

  // Filter students by search
  const filteredStudents = students.filter((student) => {
    const searchLower = search.toLowerCase();
    return (
      student.firstName?.toLowerCase().includes(searchLower) ||
      student.lastName?.toLowerCase().includes(searchLower) ||
      student.email?.toLowerCase().includes(searchLower) ||
      student.matricNumber?.toLowerCase().includes(searchLower)
    );
  });

  // Pagination logic
  const indexOfLast = currentPage * studentsPerPage;
  const indexOfFirst = indexOfLast - studentsPerPage;
  const currentStudents = filteredStudents.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">Manage Students</h2>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
        <input
          type="text"
          placeholder="Search by name, email, or matric number..."
          value={search}
          onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
          className="border rounded px-3 py-2 w-full md:w-1/3"
        />
        <span className="text-gray-500 text-sm mt-1 md:mt-0">{filteredStudents.length} students found</span>
      </div>
      {message && (
        <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded-lg mb-4 text-center">
          <span>{message}</span>
        </div>
      )}
      {loading ? (
        <div className="text-center text-gray-500">Loading...</div>
      ) : filteredStudents.length === 0 ? (
        <div className="text-center text-gray-500">No students found</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 shadow">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-3">First Name</th>
                <th className="border p-3">Last Name</th>
                <th className="border p-3">Email</th>
                <th className="border p-3">Matric No</th>
                <th className="border p-3">Phone</th>
                <th className="border p-3">Status</th>
                <th className="border p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentStudents.map((student) => (
                <tr key={student._id} className="hover:bg-gray-50">
                  {editId === student._id ? (
                    <>
                      <td className="border p-3"><input name="firstName" value={editData.firstName} onChange={handleEditChange} className="border rounded p-1 w-full" /></td>
                      <td className="border p-3"><input name="lastName" value={editData.lastName} onChange={handleEditChange} className="border rounded p-1 w-full" /></td>
                      <td className="border p-3"><input name="email" value={editData.email} onChange={handleEditChange} className="border rounded p-1 w-full" /></td>
                      <td className="border p-3"><input name="matricNumber" value={editData.matricNumber} onChange={handleEditChange} className="border rounded p-1 w-full" /></td>
                      <td className="border p-3"><input name="phone" value={editData.phone} onChange={handleEditChange} className="border rounded p-1 w-full" /></td>
                      <td className="border p-3">{student.isActive ? <span className="text-green-700 font-semibold">Active</span> : <span className="text-red-700 font-semibold">Disabled</span>}</td>
                      <td className="border p-3 flex gap-2 justify-center">
                        <button onClick={handleEditSave} className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">Save</button>
                        <button onClick={() => setEditId(null)} className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-600">Cancel</button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="border p-3">{student.firstName}</td>
                      <td className="border p-3">{student.lastName}</td>
                      <td className="border p-3">{student.email}</td>
                      <td className="border p-3">{student.matricNumber}</td>
                      <td className="border p-3">{student.phone}</td>
                      <td className="border p-3">{student.isActive ? <span className="text-green-700 font-semibold">Active</span> : <span className="text-red-700 font-semibold">Disabled</span>}</td>
                      <td className="border p-3 flex gap-2 justify-center">
                        <button onClick={() => handleEdit(student)} className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">Edit</button>
                        <button onClick={() => handleDelete(student._id)} className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700">Delete</button>
                        {student.isActive ? (
                          <button onClick={() => handleDisable(student._id)} className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600">Disable</button>
                        ) : (
                          <button onClick={() => handleEnable(student._id)} className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700">Enable</button>
                        )}
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-4">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded border bg-gray-200 text-gray-700 disabled:opacity-50"
              >
                Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-1 rounded border ${currentPage === page ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded border bg-gray-200 text-gray-700 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ManageStudentsMain;