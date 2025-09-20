


import React, { useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '@/config/api';

export default function CreatMaintenaceForm() {
  const [hostel, setHostel] = useState('');
  const [room, setRoom] = useState('');
  const [block, setBlock] = useState('');
  const [floor, setFloor] = useState('');
  const [issueDescription, setIssueDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Get studentId from localStorage (set at login)
  const studentId = localStorage.getItem('studentId');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    if (!studentId) {
      setError('Student not logged in.');
      return;
    }
    if (!hostel || !room || !block || !floor || !issueDescription) {
      setError('All fields are required.');
      return;
    }
    setLoading(true);
    try {
      const payload = {
        student: studentId,
        hostel,
        room,
        roomBlock: block,
        roomFloor: floor,
        issueDescription,
      };
      await axios.post(`${API_BASE_URL}/maintenance`, payload);
      setSuccess('Maintenance request submitted successfully!');
      setHostel('');
      setRoom('');
      setBlock('');
      setFloor('');
      setIssueDescription('');
    } catch (err) {
      setError(err.response?.data?.message || 'Error submitting request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow mt-8">
      <h2 className="text-2xl font-bold mb-6 text-blue-900">Create Maintenance Request</h2>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      {success && <div className="text-green-600 mb-2">{success}</div>}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block mb-1 font-medium">Hostel</label>
          <input
            type="text"
            className="w-full border rounded px-2 py-2"
            value={hostel}
            onChange={e => setHostel(e.target.value)}
            required
            placeholder="Enter hostel name"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Room</label>
          <input
            type="text"
            className="w-full border rounded px-2 py-2"
            value={room}
            onChange={e => setRoom(e.target.value)}
            required
            placeholder="Enter room number"
          />
        </div>
        <div className="flex gap-4">
          <div className="w-1/2">
            <label className="block mb-1 font-medium">Block</label>
            <input
              type="text"
              className="w-full border rounded px-2 py-2"
              value={block}
              onChange={e => setBlock(e.target.value)}
              required
              placeholder="Enter block"
            />
          </div>
          <div className="w-1/2">
            <label className="block mb-1 font-medium">Floor</label>
            <input
              type="text"
              className="w-full border rounded px-2 py-2"
              value={floor}
              onChange={e => setFloor(e.target.value)}
              required
              placeholder="Enter floor"
            />
          </div>
        </div>
        <div>
          <label className="block mb-1 font-medium">Issue Description</label>
          <textarea
            className="w-full border rounded px-2 py-2"
            value={issueDescription}
            onChange={e => setIssueDescription(e.target.value)}
            rows={4}
            required
            placeholder="Describe the issue..."
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded w-full font-semibold"
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Submit Request'}
        </button>
      </form>
    </div>
  );
}
``