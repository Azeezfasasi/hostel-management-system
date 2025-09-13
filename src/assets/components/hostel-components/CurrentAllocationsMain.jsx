import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "@/config/api";


const CurrentAllocationsMain = () => {
  const [allocations, setAllocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

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

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Current Allocations</h3>
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
                <td colSpan="7" className="text-center p-4 text-gray-500">Loading...</td>
              </tr>
            ) : allocations.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center p-4 text-gray-500">No allocations yet</td>
              </tr>
            ) : (
              allocations.map((a, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="border p-3">{a.student?.firstName} {a.student?.lastName}</td>
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
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CurrentAllocationsMain;
