import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "@/config/api";
import { Eye, CircleX, UserRoundX } from 'lucide-react';

const CurrentAllocationsMain = () => {
  const [allocations, setAllocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [hostelFilter, setHostelFilter] = useState("");
  const [blockFilter, setBlockFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const allocationsPerPage = 10;
  const [showModal, setShowModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const fetchAllocations = async () => {
    setLoading(true);
    setMessage("");
    try {
      const token = localStorage.getItem("token");
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      const res = await axios.get(`${API_BASE_URL}/room/allocations`, config);
      setAllocations(res.data.data || []);
    } catch (err) {
      console.log(err);
      setMessage("Failed to fetch allocations");
    }
    setLoading(false);
  };

  // Get unique hostels and blocks for filter dropdowns
  const hostelOptions = Array.from(new Set(allocations.map(a => a.hostel?.name).filter(Boolean)));
  const blockOptions = Array.from(new Set(allocations.map(a => a.block).filter(Boolean)));

  useEffect(() => {
    fetchAllocations();
  }, []);


  // Show student details modal
  function handleViewDetails(allocation) {
    setSelectedStudent(allocation);
    setShowModal(true);
  }

  function handleCloseModal() {
    setShowModal(false);
    setSelectedStudent(null);
  }

  const handleUnassign = async (roomId, studentId) => {
    setMessage("");
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      };
      await axios.post(`${API_BASE_URL}/room/unassign`, { roomId, studentId }, config);
      setMessage("Student unassigned successfully");
      fetchAllocations();
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to unassign student");
    }
  };

  // Filtered allocations
  const filteredAllocations = allocations.filter(a => {
    // Search by name or matric number
    const searchMatch =
      !search ||
      (a.student?.firstName?.toLowerCase().includes(search.toLowerCase()) ||
        a.student?.lastName?.toLowerCase().includes(search.toLowerCase()) ||
        a.student?.matricNumber?.toLowerCase().includes(search.toLowerCase()));
    const hostelMatch = !hostelFilter || a.hostel?.name === hostelFilter;
    const blockMatch = !blockFilter || a.block === blockFilter;
    return searchMatch && hostelMatch && blockMatch;
  });

  // Pagination logic
  const indexOfLast = currentPage * allocationsPerPage;
  const indexOfFirst = indexOfLast - allocationsPerPage;
  const currentAllocations = filteredAllocations.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredAllocations.length / allocationsPerPage);

  return (
    <div className="mt-6 p-4 md:p-0">
      <h3 className="text-xl font-semibold mb-4">Current Allocations</h3>
      {/* Search and Filters */}
      <div className="flex flex-wrap gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by name or matric no."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 w-64"
        />
        <select
          value={hostelFilter}
          onChange={e => setHostelFilter(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2"
        >
          <option value="">All Hostels</option>
          {hostelOptions.map(h => (
            <option key={h} value={h}>{h}</option>
          ))}
        </select>
        <select
          value={blockFilter}
          onChange={e => setBlockFilter(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2"
        >
          <option value="">All Blocks</option>
          {blockOptions.map(b => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>
      </div>
      {message && (
        <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded-lg mb-4 text-center">
          <span>{message}</span>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300 shadow">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-3">Student</th>
              <th className="border p-3">Matric NO.</th>
              <th className="border p-3">Campus</th>
              <th className="border p-3">Hostel</th>
              <th className="border p-3">Block</th>
              <th className="border p-3">Floor</th>
              <th className="border p-3">Room</th>
              <th className="border p-3">Bed</th>
              <th className="border p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8" className="text-center p-4 text-gray-500">Loading...</td>
              </tr>
            ) : filteredAllocations.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center p-4 text-gray-500">No allocations found</td>
              </tr>
            ) : (
              currentAllocations.map((a, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="border p-3">{a.student?.firstName} {a.student?.lastName}</td>
                  <td className="border p-3">{a.student?.matricNumber}</td>
                  <td className="border p-3">{a.hostel?.hostelCampus || 'NA'}</td>
                  <td className="border p-3">{a.hostel?.name}</td>
                  <td className="border p-3">{a.block}</td>
                  <td className="border p-3">{a.floor}</td>
                  <td className="border p-3">{a.room}</td>
                  <td className="border p-3">Bed {a.bed + 1}</td>
                  <td className="border p-3 flex gap-2">
                    <button
                      onClick={() => handleViewDetails(a)}
                      className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 cursor-pointer"
                    >
                      <Eye />
                    </button>
                    <button
                      onClick={() => handleUnassign(a.roomId, a.student?._id)}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 flex items-center gap-1 cursor-pointer"
                    >
                      <UserRoundX  /> Unassign
                    </button>
                  </td>
                </tr>
              ))
            )}
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-6 gap-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 rounded border bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
                >
                  Prev
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-3 py-1 rounded border ${currentPage === i + 1 ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 rounded border bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </tbody>
        </table>

        {/* Student Details Modal */}
        {showModal && selectedStudent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-md h-[600px] w-full overflow-y-auto relative">
              <button
                onClick={handleCloseModal}
                className="absolute top-2 right-2 text-red-600 hover:text-red-700 text-2xl font-bold cursor-pointer"
                aria-label="Close"
              >
                <CircleX className="w-10 h-10" />
              </button>
              <div className="flex flex-col items-center gap-4">
                {/* Profile Image */}
                {selectedStudent.student?.profileImage ? (
                  <img src={selectedStudent.student.profileImage} alt="Profile" className="w-24 h-24 rounded-full object-cover border-2 border-blue-400" />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-3xl text-gray-500 border-2 border-gray-300">
                    <span>{selectedStudent.student?.firstName?.[0] || ''}{selectedStudent.student?.lastName?.[0] || ''}</span>
                  </div>
                )}
                <div className="text-left">
                  <h3 className="text-xl font-bold mb-1">{selectedStudent.student?.firstName} {selectedStudent.student?.lastName} {selectedStudent.student?.otherName && <span>{selectedStudent.student.otherName}</span>}</h3>

                  <p className="text-blue-600 mb-1">Matric No: <span className="font-semibold text-gray-500">{selectedStudent.student?.matricNumber}</span></p>

                  <p className="text-blue-600 mb-1">Date of Birth: <span className="font-semibold text-gray-500 capitalize">{selectedStudent.student?.dob}</span></p>

                  <p className="text-blue-600 mb-1">Gender: <span className="font-semibold text-gray-500 capitalize">{selectedStudent.student?.gender}</span></p>

                  <p className="text-blue-600 mb-1">Email: <span className="font-semibold text-gray-500">{selectedStudent.student?.email}</span></p>

                  {selectedStudent.student?.phone && <p className="text-blue-600 mb-1">Phone: <span className="font-semibold text-gray-600">{selectedStudent.student.phone}</span></p>}

                  {selectedStudent.student?.emergencyContact && <p className="text-blue-600 mb-1">Emergency Contact: <span className="font-semibold text-gray-600">{selectedStudent.student.emergencyContact}</span></p>}

                  {selectedStudent.student?.address && <p className="text-blue-600 mb-1">Address: <span className="font-semibold text-gray-600">{selectedStudent.student.address}</span></p>}

                  {selectedStudent.student?.nin && <p className="text-blue-600 mb-1">NIN: <span className="font-semibold text-gray-600">{selectedStudent.student.nin}</span></p>}

                  {selectedStudent.student?.state && <p className="text-blue-600 mb-1">State: <span className="font-semibold text-gray-600">{selectedStudent.student.state}</span></p>}

                  {selectedStudent.student?.city && <p className="text-blue-600 mb-1">City: <span className="font-semibold text-gray-600">{selectedStudent.student.city}</span></p>}

                  {selectedStudent.student?.department && <p className="text-blue-600 mb-1">Department: <span className="font-semibold text-gray-600">{selectedStudent.student.department}</span></p>}

                  {selectedStudent.student?.course && <p className="text-blue-600 mb-1">Course: <span className="font-semibold text-gray-600">{selectedStudent.student.course}</span></p>}

                  {selectedStudent.student?.level && <p className="text-blue-600 mb-1">Level: <span className="font-semibold text-gray-600">{selectedStudent.student.level}</span></p>}

                  <div className="text-[24px] font-bold mt-4 mb-2">Student Hostel Details</div>
                  <p className="text-blue-600 mb-1">Campus: <span className="font-semibold text-gray-600">{selectedStudent.hostel?.hostelCampus || ''}</span></p>

                  <p className="text-blue-600 mb-1">Hostel Name: <span className="font-semibold text-gray-600">{selectedStudent.hostel?.name}</span></p>

                  <p className="text-blue-600 mb-1">Block: <span className="font-semibold text-gray-600">{selectedStudent.block}</span></p>

                  <p className="text-blue-600 mb-1">Floor: <span className="font-semibold text-gray-600">{selectedStudent.floor}</span></p>

                  <p className="text-blue-600 mb-1">Room Number: <span className="font-semibold text-gray-600">{selectedStudent.room}</span></p>

                  <p className="text-blue-600 mb-1">Bed: <span className="font-semibold text-gray-600">{(selectedStudent.bed + 1) || ''}</span></p>
                  {/* If you want to show price/facilities, you need to fetch room details separately */}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CurrentAllocationsMain;
