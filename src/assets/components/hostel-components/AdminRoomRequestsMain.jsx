import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "@/config/api";

const AdminRoomRequestMain = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const requestsPerPage = 10;

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    setMessage("");
    try {
      const token = localStorage.getItem("token");
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      // Adjust endpoint as needed for your backend
      const res = await axios.get(`${API_BASE_URL}/room/requests`, config);
      // Sort by createdAt descending (recent first)
      const sorted = (res.data.data || []).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setRequests(sorted);
    } catch (err) {
      console.log(err);
      setMessage("Failed to fetch room requests");
    }
    setLoading(false);
  };

  const handleAction = async (requestId, action) => {
    setMessage("");
    try {
      const token = localStorage.getItem("token");
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      // Adjust endpoint as needed for your backend
      const res = await axios.post(`${API_BASE_URL}/room/requests/${requestId}/${action}`, {}, config);
      if (res.data && res.data.success) {
        setMessage(`Request ${action}ed successfully`);
        fetchRequests();
      } else {
        setMessage(res.data.message || `Failed to ${action} request`);
      }
    } catch (err) {
      setMessage(err.response?.data?.message || `Network error while trying to ${action} request`);
    }
  };

  // Filter and search logic
  const filteredRequests = requests.filter(req => {
    // Status filter
    if (statusFilter && req.status !== statusFilter) return false;
    // Search by name or matric number
    if (searchTerm) {
      const name = `${req.student?.firstName || ''} ${req.student?.lastName || ''}`.toLowerCase();
      const matric = (req.student?.matricNumber || '').toLowerCase();
      const term = searchTerm.toLowerCase();
      if (!name.includes(term) && !matric.includes(term)) return false;
    }
    return true;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredRequests.length / requestsPerPage);
  const indexOfLast = currentPage * requestsPerPage;
  const indexOfFirst = indexOfLast - requestsPerPage;
  const currentRequests = filteredRequests.slice(indexOfFirst, indexOfLast);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">Room Requests</h2>
      {/* Filters and Search */}
      <div className="flex flex-wrap gap-4 mb-6 justify-center">
        <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setCurrentPage(1); }} className="border rounded p-2">
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="declined">Declined</option>
        </select>
        <input
          type="text"
          value={searchTerm}
          onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
          placeholder="Search by name or matric number"
          className="border rounded p-2"
        />
      </div>
      {message && (
        <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded-lg mb-4 text-center">
          <span>{message}</span>
        </div>
      )}
      {loading ? (
        <div className="text-center text-gray-500">Loading...</div>
      ) : filteredRequests.length === 0 ? (
        <div className="text-center text-gray-500">No room requests found</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-600 shadow">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-3">Student</th>
                <th className="border p-3">Matric No.</th>
                <th className="border p-3">Hostel</th>
                <th className="border p-3">Block</th>
                <th className="border p-3">Floor</th>
                <th className="border p-3">Room</th>
                <th className="border p-3">Bed</th>
                <th className="border p-3">Status</th>
                <th className="border p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentRequests.map((req, idx) => (
                <tr key={req._id || idx} className="hover:bg-gray-50">
                  <td className="border p-3">{req.student?.firstName} {req.student?.lastName}</td>
                  <td className="border p-3">{req.student?.matricNumber || ''}</td>
                  <td className="border p-3">{req.room?.hostelId?.name || ''}</td>
                  <td className="border p-3">{req.room?.roomBlock || ''}</td>
                  <td className="border p-3">{req.room?.roomFloor || ''}</td>
                  <td className="border p-3">{req.room?.roomNumber || ''}</td>
                  <td className="border p-3">Bed {Number(req.bed) + 1}</td>
                  <td className={`border p-3 capitalize ${req.status === 'approved' ? 'text-green-700 font-semibold' : req.status === 'declined' ? 'text-red-700 font-semibold' : req.status === 'pending' ? 'text-blue-700 font-semibold' : ''}`}>{req.status}</td>
                  <td className="p-3 flex gap-2 justify-center">
                    {req.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleAction(req._id, 'approve')}
                          className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleAction(req._id, 'decline')}
                          className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                        >
                          Decline
                        </button>
                      </>
                    )}
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
        </div>
      )}
    </div>
  );
};

export default AdminRoomRequestMain;
