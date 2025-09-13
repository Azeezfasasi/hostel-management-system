import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "@/config/api";

const AdminRoomRequestMain = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

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
      setRequests(res.data.data || []);
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

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">Room Requests</h2>
      {message && (
        <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded-lg mb-4 text-center">
          <span>{message}</span>
        </div>
      )}
      {loading ? (
        <div className="text-center text-gray-500">Loading...</div>
      ) : requests.length === 0 ? (
        <div className="text-center text-gray-500">No pending room requests</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 shadow">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-3">Student</th>
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
              {requests.map((req, idx) => (
                <tr key={req._id || idx} className="hover:bg-gray-50">
                  <td className="border p-3">{req.student?.firstName} {req.student?.lastName}</td>
                  <td className="border p-3">{req.hostel?.name}</td>
                  <td className="border p-3">{req.block}</td>
                  <td className="border p-3">{req.floor}</td>
                  <td className="border p-3">{req.room}</td>
                  <td className="border p-3">Bed {Number(req.bed) + 1}</td>
                  <td className="border p-3">{req.status}</td>
                  <td className="border p-3 flex gap-2 justify-center">
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
        </div>
      )}
    </div>
  );
};

export default AdminRoomRequestMain;
