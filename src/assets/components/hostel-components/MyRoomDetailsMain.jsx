import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '@/config/api';

function MyRoomDetailsMain() {
  const [roomDetails, setRoomDetails] = useState(null);
  const [requestStatus, setRequestStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');


  const fetchRoomDetails = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
  // Fetch all room requests for the user (student endpoint)
  const res = await axios.get(`${API_BASE_URL}/room/my-requests`, config);
      // Find the latest request for the logged-in student
      const requests = res.data.data || [];
      // Sort by createdAt descending
      requests.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      const latestRequest = requests.find(r => r.student && r.student._id === getUserId());
      if (latestRequest) {
        setRoomDetails(latestRequest.room || null);
        setRequestStatus(latestRequest.status || 'pending');
        // Optionally, store the whole request for more details
        setFullRequest(latestRequest);
      } else {
        setRoomDetails(null);
        setRequestStatus(null);
        setFullRequest(null);
      }
    } catch (err) {
      console.log(err);
      setError('Failed to fetch room details.');
    }
    setLoading(false);
  }, []);

  // Store the full request for more details
  const [fullRequest, setFullRequest] = useState(null);

  useEffect(() => {
    fetchRoomDetails();
  }, [fetchRoomDetails]);

  // (Removed duplicate fetchRoomDetails, only useCallback version remains above)

  // Helper to get user id from token (JWT)
  function getUserId() {
    try {
      const token = localStorage.getItem('token');
      if (!token) return null;
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.id;
    } catch {
      return null;
    }
  }

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-md mt-8">
      <h2 className="text-2xl font-bold mb-4 text-center">My Room Details</h2>
      {loading ? (
        <div className="text-center text-gray-500">Loading...</div>
      ) : error ? (
        <div className="text-center text-red-600">{error}</div>
      ) : !roomDetails ? (
        <div className="text-center text-gray-500">No room request found.</div>
      ) : (
        <div>
          <div className="mb-4 flex flex-col gap-2">
            <div><span className="font-semibold">Room Number:</span> {roomDetails.roomNumber || '-'}</div>
            <div><span className="font-semibold">Hostel:</span> {roomDetails.hostelId?.name || '-'}</div>
            <div><span className="font-semibold">Block:</span> {roomDetails.block || fullRequest?.room?.roomBlock || '-'}</div>
            <div><span className="font-semibold">Floor:</span> {roomDetails.floor || fullRequest?.room?.roomFloor || '-'}</div>
            <div><span className="font-semibold">Bed Number:</span> {fullRequest?.bed !== undefined ? fullRequest.bed + 1 : '-'}</div>
            <div><span className="font-semibold">Request Date:</span> {fullRequest?.createdAt ? new Date(fullRequest.createdAt).toLocaleString() : '-'}</div>
            <div><span className="font-semibold">Request ID:</span> {fullRequest?._id || '-'}</div>
          </div>
          <div className="mt-6 text-center">
            <span className="font-semibold">Request Status: </span>
            {requestStatus === 'approved' && (
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold">Approved</span>
            )}
            {requestStatus === 'declined' && (
              <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full font-semibold">Rejected</span>
            )}
            {requestStatus === 'pending' && (
              <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full font-semibold">Pending</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default MyRoomDetailsMain;