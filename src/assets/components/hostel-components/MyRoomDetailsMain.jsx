import React, { useEffect, useState, useCallback, useRef } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '@/config/api';
import html2canvas from 'html2canvas';

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
      // Get the latest request for the logged-in student
      const requests = res.data.data || [];
      // Sort by createdAt descending
      requests.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      const latestRequest = requests[0];
      if (latestRequest) {
        // Merge student and room details for the card
        const student = latestRequest.student || {};
        const room = latestRequest.room || {};
        setRoomDetails({
          ...student,
          ...room,
          hostelName: room.hostelId?.name || '',
        });
        setRequestStatus(latestRequest.status || 'pending');
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

  // Ref for the card to print/download
  const cardRef = useRef(null);

  const handlePrint = () => {
    if (cardRef.current) {
      const printContents = cardRef.current.innerHTML;
      const win = window.open('', '', 'height=700,width=500');
      win.document.write('<html><head><title>Room Details Card</title>');
      win.document.write('<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/tailwindcss/dist/tailwind.min.css">');
      win.document.write('</head><body >');
      win.document.write(printContents);
      win.document.write('</body></html>');
      win.document.close();
      win.print();
    }
  };

  const handleDownload = async () => {
    if (cardRef.current) {
      const canvas = await html2canvas(cardRef.current);
      const link = document.createElement('a');
      link.download = 'room-details-card.png';
      link.href = canvas.toDataURL();
      link.click();
    }
  };

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
          {/* ID Card / Photo Card */}
          <div ref={cardRef} className="mx-auto bg-gradient-to-br from-blue-50 to-white rounded-xl shadow-lg p-6 w-full max-w-md border border-blue-200">
            <div className="flex flex-col items-center mb-4">
              <img
                src={roomDetails.profileImage || '/default-profile.png'}
                alt={roomDetails.firstName || 'Profile'}
                className="w-24 h-24 rounded-full border-4 border-blue-300 object-cover mb-2"
              />
              <div className="text-lg font-bold text-blue-800">{roomDetails.firstName} {roomDetails.lastName}</div>
              <div className="text-sm text-gray-600">Other Name: {roomDetails.otherName || '-'}</div>
              <div className="text-sm text-gray-600">Phone: {roomDetails.phone || '-'}</div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm mb-2">
              <div><span className="font-semibold">Matric No:</span> {roomDetails.matricNumber || '-'}</div>
              <div><span className="font-semibold">Gender:</span> {roomDetails.gender || '-'}</div>
              <div><span className="font-semibold">Campus:</span> {roomDetails.campusName || '-'}</div>
              <div><span className="font-semibold">Department:</span> {roomDetails.department || '-'}</div>
              <div><span className="font-semibold">Course:</span> {roomDetails.course || '-'}</div>
              <div><span className="font-semibold">Level:</span> {roomDetails.level || '-'}</div>
              <div><span className="font-semibold">Room No:</span> {roomDetails.roomNumber || '-'}</div>
              <div><span className="font-semibold">Hostel:</span> {roomDetails.hostelId?.name || '-'}</div>
              <div><span className="font-semibold">Block:</span> {roomDetails.block || fullRequest?.room?.roomBlock || '-'}</div>
              <div><span className="font-semibold">Floor:</span> {roomDetails.floor || fullRequest?.room?.roomFloor || '-'}</div>
              <div><span className="font-semibold">Bed No:</span> {fullRequest?.bed !== undefined ? fullRequest.bed + 1 : '-'}</div>
              <div><span className="font-semibold">Room Price:</span> ₦{roomDetails.price}</div>
              <div><span className="font-semibold">Request Date:</span> {fullRequest?.createdAt ? new Date(fullRequest.createdAt).toLocaleString() : '-'}</div>
              <div><span className="font-semibold">Request ID:</span> {fullRequest?._id || '-'}</div>
            </div>
            <div className="mt-4 text-center">
              <span className="font-semibold">Status: </span>
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
          <div className='border-t mt-6 pt-4 flex justify-center gap-4'>
            <button onClick={handlePrint} className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700">Print Card</button>
            <button type="button" onClick={handleDownload} className="bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700">Download Card</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyRoomDetailsMain;