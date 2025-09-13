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
  const [showModal, setShowModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentAllocation, setStudentAllocation] = useState(null);

  const handleViewDetails = async (student) => {
    setSelectedStudent(student);
    setShowModal(true);
    setStudentAllocation(null);
    try {
      const token = localStorage.getItem('token');
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      // Fetch all allocations and find the one for this student
      const res = await axios.get(`${API_BASE_URL}/room/allocations`, config);
      const allocations = res.data?.data || [];
      const allocation = allocations.find(a => a.student?._id === student._id);
      setStudentAllocation(allocation || null);
    } catch (err) {
      console.log(err);
      setStudentAllocation(null);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedStudent(null);
    setStudentAllocation(null);
  };

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
                        <button onClick={() => handleViewDetails(student)} className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-700">View Details</button>
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
                  {/* Student Details Modal */}
                  {showModal && selectedStudent && selectedStudent._id === student._id && (
                    <td colSpan={7} className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full relative">
                        <button
                          onClick={handleCloseModal}
                          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-2xl font-bold"
                          aria-label="Close"
                        >
                          &times;
                        </button>
                        <div className="flex flex-col items-center gap-4">
                          {/* Profile Image */}
                          {selectedStudent.profileImage ? (
                            <img src={selectedStudent.profileImage} alt="Profile" className="w-24 h-24 rounded-full object-cover border-2 border-blue-400" />
                          ) : (
                            <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-3xl text-gray-500 border-2 border-gray-300">
                              <span>{selectedStudent.firstName?.[0] || ''}{selectedStudent.lastName?.[0] || ''}</span>
                            </div>
                          )}
                          <div className="text-left">
                            <h3 className="text-xl font-bold mb-1 text-center">{selectedStudent.firstName} {selectedStudent.lastName} {selectedStudent.otherName && <span>{selectedStudent.otherName}</span>}</h3>
                            <p className="text-blue-600 mb-1">Matric No: <span className="font-semibold text-gray-500">{selectedStudent.matricNumber}</span></p>
                            <p className="text-blue-600 mb-1">Gender: <span className="font-semibold text-gray-500">{selectedStudent.gender}</span></p>
                            <p className="text-blue-600 mb-1">Email: <span className="font-semibold text-gray-500">{selectedStudent.email}</span></p>
                            {selectedStudent.phone && <p className="text-blue-600 mb-1">Phone: <span className="font-semibold text-gray-600">{selectedStudent.phone}</span></p>}
                            {selectedStudent.emergencyContact && <p className="text-blue-600 mb-1">Emergency Contact: <span className="font-semibold text-gray-600">{selectedStudent.emergencyContact}</span></p>}
                            {selectedStudent.address && <p className="text-blue-600 mb-1">Address: <span className="font-semibold text-gray-600">{selectedStudent.address}</span></p>}
                            {selectedStudent.nin && <p className="text-blue-600 mb-1">NIN: <span className="font-semibold text-gray-600">{selectedStudent.nin}</span></p>}
                            {selectedStudent.state && <p className="text-blue-600 mb-1">State: <span className="font-semibold text-gray-600">{selectedStudent.state}</span></p>}
                            {selectedStudent.city && <p className="text-blue-600 mb-1">City: <span className="font-semibold text-gray-600">{selectedStudent.city}</span></p>}
                            {selectedStudent.department && <p className="text-blue-600 mb-1">Department: <span className="font-semibold text-gray-600">{selectedStudent.department}</span></p>}
                            {selectedStudent.course && <p className="text-blue-600 mb-1">Course: <span className="font-semibold text-gray-600">{selectedStudent.course}</span></p>}
                            {selectedStudent.level && <p className="text-blue-600 mb-1">Level: <span className="font-semibold text-gray-600">{selectedStudent.level}</span></p>}

                            {/* Hostel details from allocation */}
                            <div className="text-[20px] font-bold mt-4 mb-2 border-t pt-3">Student Hostel Details</div>
                            <p className="text-blue-600 mb-1">Hostel Name: <span className="font-semibold text-gray-600">{studentAllocation?.hostel?.name || 'Not assigned'}</span></p>
                            <p className="text-blue-600 mb-1">Block: <span className="font-semibold text-gray-600">{studentAllocation?.block || 'Not assigned'}</span></p>
                            <p className="text-blue-600 mb-1">Floor: <span className="font-semibold text-gray-600">{studentAllocation?.floor || 'Not assigned'}</span></p>
                            <p className="text-blue-600 mb-1">Room Number: <span className="font-semibold text-gray-600">{studentAllocation?.room || 'Not assigned'}</span></p>
                            <p className="text-blue-600 mb-1">Bed: <span className="font-semibold text-gray-600">{typeof studentAllocation?.bed === 'number' ? studentAllocation.bed + 1 : 'Not assigned'}</span></p>
                          </div>
                        </div>
                      </div>
                    </td>
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