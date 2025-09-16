import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "@/config/api";

const StudentPendingPayments = () => {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [payLoading, setPayLoading] = useState("");

  useEffect(() => {
    fetchPendingRequests();
  }, []);

  const fetchPendingRequests = async () => {
    setLoading(true);
    setMessage("");
    try {
      const token = localStorage.getItem("token");
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      // Fetch student's room requests
      const res = await axios.get(`${API_BASE_URL}/room/my-requests`, config);
      // Filter for paymentStatus: 'pending' or 'failed'
      const filtered = (res.data.data || []).filter(
        req => req.paymentStatus === "pending" || req.paymentStatus === "failed"
      );
      setPendingRequests(filtered);
    } catch (err) {
      console.error(err);
      setMessage("Failed to fetch pending payments");
    }
    setLoading(false);
  };

  const handlePayNow = async (request) => {
    setPayLoading(request._id);
    setMessage("");
    try {
      const token = localStorage.getItem("token");
      const studentEmail = localStorage.getItem("studentEmail");
      const studentFirstName = localStorage.getItem("studentFirstName") || "Student";
      const studentLastName = localStorage.getItem("studentLastName") || "";
      const studentPhone = localStorage.getItem("studentPhone") || "";
      const reference = Math.random().toString(36).substring(2, 22);
      // Get room price from request.room
      const amount = request.room?.price || 50000;
      // Call backend to get payment authorizationUrl
      const { data } = await axios.post(
        `${API_BASE_URL}/payment/init`,
        {
          amount: amount * 100,
          email: studentEmail,
          reference,
          customerFirstName: studentFirstName,
          customerLastName: studentLastName,
          customerPhoneNumber: studentPhone,
          callbackUrl: window.location.origin + "/payment/callback",
          metadata: { bookingId: request._id }
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data?.status === "success" && data.data?.authorizationUrl) {
        window.location.href = data.data.authorizationUrl;
      } else {
        setMessage("Failed to start payment.");
      }
    } catch (err) {
      console.error(err);
      setMessage("Error starting payment.");
    }
    setPayLoading("");
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-md mt-8">
      <h2 className="text-2xl font-bold mb-4 text-center">Pending/Failed Payments</h2>
      {loading ? (
        <div className="text-center text-gray-500">Loading...</div>
      ) : message ? (
        <div className="text-center text-red-600">{message}</div>
      ) : pendingRequests.length === 0 ? (
        <div className="text-center text-gray-500">No pending or failed payments found.</div>
      ) : (
        <div>
          <table className="w-full border-collapse border border-gray-600 shadow mb-6">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-3">Room</th>
                <th className="border p-3">Bed</th>
                <th className="border p-3">Amount</th>
                <th className="border p-3">Status</th>
                <th className="border p-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {pendingRequests.map((req) => (
                <tr key={req._id}>
                  <td className="border p-3">{req.room?.roomNumber || "-"}</td>
                  <td className="border p-3">Bed {Number(req.bed) + 1}</td>
                  <td className="border p-3">₦{req.room?.price?.toLocaleString("en-NG") || "-"}</td>
                  <td className="border p-3 capitalize">{req.paymentStatus}</td>
                  <td className="border p-3">
                    <button
                      className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 disabled:opacity-60"
                      disabled={payLoading === req._id}
                      onClick={() => handlePayNow(req)}
                    >
                      {payLoading === req._id ? "Processing..." : "Pay Now"}
                    </button>
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

export default StudentPendingPayments;
