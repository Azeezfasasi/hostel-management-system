import React, { useEffect, useState, useCallback, useRef } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '@/config/api';
import html2canvas from 'html2canvas';
import roomdetailscard from '../../images/roomdetailscard.png';

function MyRoomDetailsMain() {
  const [roomDetails, setRoomDetails] = useState(null);
  const [requestStatus, setRequestStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [fullRequest, setFullRequest] = useState(null);
  const cardRef = useRef(null);

  const fetchRoomDetails = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
  const res = await axios.get(`${API_BASE_URL}/room/my-requests`);
      const requests = res.data.requests || [];
      requests.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      const latestRequest = requests[0];
      if (latestRequest) {
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

  useEffect(() => {
    fetchRoomDetails();
  }, [fetchRoomDetails]);

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
      const canvas = await html2canvas(cardRef.current, { useCORS: true });
      const link = document.createElement('a');
      link.download = 'room-details-card.png';
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  // Only show details if not rejected and room exists
  if (requestStatus === "rejected" || !roomDetails) {
    return (
      <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-md mt-8">
        <h2 className="text-2xl font-bold mb-4 text-center">My Room Details</h2>
        <div className="text-center text-gray-500">Room request has been rejected or no room assigned.</div>
      </div>
    );
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
          {/* ID Card / Photo Card */}
          <div
            ref={cardRef}
            className="mx-auto rounded-xl shadow-lg p-6 w-full max-w-md"
            style={{
              background: 'linear-gradient(to bottom right, #eff6ff, #ffffff)',
              border: '1px solid #60a5fa', // blue-400
            }}
          >
            <div className="flex flex-col items-center mb-4">
              <img
                src={roomDetails.profileImage || roomdetailscard}
                alt={roomDetails.firstName || 'Profile'}
                style={{ width: '96px', height: '96px', borderRadius: '10%', border: '4px solid #60a5fa', objectFit: 'cover', marginBottom: '8px' }}
              />
              <div style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#1e40af' }}>{roomDetails.firstName} {roomDetails.lastName} {roomDetails.otherName || '-'}</div>
              <div style={{ fontSize: '0.875rem', color: '#4b5563' }}>Phone: {roomDetails.phone || '-'}</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.875rem', marginBottom: '8px' }}>
              <div><span style={{ fontWeight: '600' }}>Matric No:</span> {roomDetails.matricNumber || '-'}</div>
              <div><span style={{ fontWeight: '600' }}>Gender:</span> {roomDetails.gender || '-'}</div>
              <div><span style={{ fontWeight: '600' }}>Campus:</span> {roomDetails.campusName || '-'}</div>
              <div><span style={{ fontWeight: '600' }}>Department:</span> {roomDetails.department || '-'}</div>
              <div><span style={{ fontWeight: '600' }}>Course:</span> {roomDetails.course || '-'}</div>
              <div><span style={{ fontWeight: '600' }}>Level:</span> {roomDetails.level || '-'}</div>
              <div><span style={{ fontWeight: '600' }}>Room No:</span> {roomDetails.roomNumber || '-'}</div>
              <div><span style={{ fontWeight: '600' }}>Hostel:</span> {roomDetails.hostelId?.name || '-'}</div>
              <div><span style={{ fontWeight: '600' }}>Block:</span> {roomDetails.block || fullRequest?.room?.roomBlock || '-'}</div>
              <div><span style={{ fontWeight: '600' }}>Floor:</span> {roomDetails.floor || fullRequest?.room?.roomFloor || '-'}</div>
              <div><span style={{ fontWeight: '600' }}>Bed No:</span> {fullRequest?.bed !== undefined ? fullRequest.bed + 1 : '-'}</div>
              <div><span style={{ fontWeight: '600' }}>Room Price:</span> ₦{roomDetails.price}</div>
              <div><span style={{ fontWeight: '600' }}>Request Date:</span> {fullRequest?.createdAt ? new Date(fullRequest.createdAt).toLocaleString() : '-'}</div>
              <div><span style={{ fontWeight: '600' }}>Request ID:</span> {fullRequest?._id || '-'}</div>
            </div>
            <div style={{ marginTop: '16px', textAlign: 'center' }}>
              <span style={{ fontWeight: '600' }}>Status: </span>
              {requestStatus === 'approved' && (
                <span style={{ background: '#bbf7d0', color: '#15803d', padding: '4px 12px', borderRadius: '9999px', fontWeight: '600' }}>Approved</span>
              )}
              {requestStatus === 'declined' && (
                <span style={{ background: '#fecaca', color: '#b91c1c', padding: '4px 12px', borderRadius: '9999px', fontWeight: '600' }}>Rejected</span>
              )}
              {requestStatus === 'pending' && (
                <span style={{ background: '#fef08a', color: '#a16207', padding: '4px 12px', borderRadius: '9999px', fontWeight: '600' }}>Pending</span>
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