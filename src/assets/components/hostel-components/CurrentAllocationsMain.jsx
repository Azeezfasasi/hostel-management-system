import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "@/config/api";


const CurrentAllocationsMain = () => {
  const [allocations, setAllocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [hostelFilter, setHostelFilter] = useState("");
  const [blockFilter, setBlockFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const allocationsPerPage = 10;

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
    <div>
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
                  <td className="border p-3">{a.hostel?.name}</td>
                  <td className="border p-3">{a.block}</td>
                  <td className="border p-3">{a.floor}</td>
                  <td className="border p-3">{a.room}</td>
                  <td className="border p-3">Bed {a.bed + 1}</td>
                  <td className="border p-3">
                    <button
                      onClick={() => handleUnassign(a.roomId, a.student?._id)}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                    >
                      Unassign
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
      </div>
    </div>
  );
};

export default CurrentAllocationsMain;
