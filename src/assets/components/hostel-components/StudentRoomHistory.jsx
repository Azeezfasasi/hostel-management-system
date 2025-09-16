import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "@/config/api";

const StudentRoomHistory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const studentsPerPage = 10;
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      // Backend endpoint should return all students and their room history
      const res = await axios.get(`${API_BASE_URL}/room/history`, config);
      setHistory(res.data.data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch room history");
    }
    setLoading(false);
  };

  // Group history by student
  // Backend returns: [{ student, rooms: [ { status, hostel, block, floor, room, bed, ... } ] }]
  // Search filter
  const filteredStudents = history.filter(s => {
    const name = `${s.student.firstName} ${s.student.lastName}`.toLowerCase();
    const matric = (s.student.matricNumber || "").toLowerCase();
    const term = searchTerm.toLowerCase();
    return name.includes(term) || matric.includes(term);
  });

  // Pagination
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);
  const indexOfLast = currentPage * studentsPerPage;
  const indexOfFirst = indexOfLast - studentsPerPage;
  const currentStudents = filteredStudents.slice(indexOfFirst, indexOfLast);

  return (
    <div className="p-6">
      {/* Search */}
      <div className="mb-4 flex flex-wrap gap-4 justify-center">
        <input
          type="text"
          value={searchTerm}
          onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
          placeholder="Search by name or matric number"
          className="border rounded p-2"
        />
      </div>
      <h2 className="text-2xl font-bold mb-6 text-center">Student Room History</h2>
  {loading ? (
        <div className="text-center text-gray-500">Loading...</div>
      ) : error ? (
        <div className="text-center text-red-600">{error}</div>
      ) : filteredStudents.length === 0 ? (
        <div className="text-center text-gray-500">No room history found</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-600 shadow">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-3">Student</th>
                <th className="border p-3">Matric No.</th>
                <th className="border p-3">Room History</th>
              </tr>
            </thead>
            <tbody>
              {currentStudents.map((s, idx) => (
                <tr key={s.student._id || idx} className="hover:bg-gray-50">
                  <td className="border p-3">{s.student.firstName} {s.student.lastName}</td>
                  <td className="border p-3">{s.student.matricNumber || ""}</td>
                  <td className="border p-3">
                    <button
                      className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                      onClick={() => { setSelectedStudent(s); setShowPopup(true); }}
                    >
                      View History
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
        {/* Popup for history */}
        {showPopup && selectedStudent && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full h-[600px] relative overflow-y-auto">
              <button
                className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 text-xl"
                onClick={() => setShowPopup(false)}
              >
                &times;
              </button>
              <h3 className="text-xl font-bold mb-4 text-center">{selectedStudent.student.firstName} {selectedStudent.student.lastName} - Room History</h3>
              <ul className="list-disc ml-4">
                {selectedStudent.rooms.map((r, i) => (
                <div 
                key={`${r.roomId || 'room'}-${i}`}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200 shadow-sm transition-all hover:shadow-md"
                >
                    {/* Left side: Room details and status */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center mb-1">
                        {/* Status badge with conditional colors */}
                        <span 
                            className={`
                            text-xs font-bold px-2 py-0.5 rounded-full
                            ${r.status === 'approved' ? 'bg-green-100 text-green-700' :
                                r.status === 'declined' ? 'bg-red-100 text-red-700' :
                                'bg-yellow-100 text-yellow-700'}
                            `}
                        >
                            {r.status ? r.status.charAt(0).toUpperCase() + r.status.slice(1) : 'Unknown'}
                        </span>
                        </div>
                        {/* Room details */}
                        <p className="text-gray-600 truncate">
                        <span className="font-semibold text-gray-800">Hostel:</span> {r.hostel || '-'} • 
                        <span className="font-semibold text-gray-800"> Block:</span> {r.block || '-'} • 
                        <span className="font-semibold text-gray-800"> Floor:</span> {r.floor || '-'} • 
                        <span className="font-semibold text-gray-800"> Room:</span> {r.room || '-'}
                        </p>
                    </div>
                </div>
                ))}
              </ul>
            </div>
          </div>
        )}
        </div>
      )}
    </div>
  );
};

export default StudentRoomHistory;
