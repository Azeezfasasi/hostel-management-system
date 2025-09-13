import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "@/config/api";

const StudentRoomBooking = ({ onBook }) => {
  const [hostels, setHostels] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [selectedHostel, setSelectedHostel] = useState("");
  const [selectedBlock, setSelectedBlock] = useState("");
  const [selectedFloor, setSelectedFloor] = useState("");
  const [selectedRoom, setSelectedRoom] = useState("");
  const [selectedBed, setSelectedBed] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
        const [hostelRes, roomRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/hostel`),
          axios.get(`${API_BASE_URL}/room`, config)
        ]);
        setHostels(hostelRes.data.data || []);
        setRooms(roomRes.data.data || []);
      } catch (err) {
        console.log(err);
        setMessage("Failed to fetch hostels or rooms");
      }
    };
    fetchData();
  }, []);

  // Get unique blocks for selected hostel
  const blockOptions = Array.from(new Set(
    rooms
      .filter(r => r.hostelId && r.hostelId._id === selectedHostel)
      .map(r => r.roomBlock)
      .filter(Boolean)
  ));

  // Get unique floors for selected hostel and block
  const floorOptions = Array.from(new Set(
    rooms
      .filter(r => r.hostelId && r.hostelId._id === selectedHostel && (!selectedBlock || r.roomBlock === selectedBlock))
      .map(r => r.roomFloor)
      .filter(Boolean)
  ));

  // Filter rooms by selected hostel, block, and floor, and only show rooms with available beds
  const filteredRooms = rooms.filter(r =>
    r.hostelId &&
    r.hostelId._id === selectedHostel &&
    (!selectedBlock || r.roomBlock === selectedBlock) &&
    (!selectedFloor || r.roomFloor === selectedFloor) &&
    (Array.isArray(r.assignedStudents) ? r.assignedStudents.length < r.capacity : false)
  );

  // For selected room, get available bed indices
  const selectedRoomObj = rooms.find(r => r._id === selectedRoom);
  const availableBedIndices = selectedRoomObj
    ? Array.from({ length: selectedRoomObj.capacity })
        .map((_, idx) => idx)
        .filter(idx => !selectedRoomObj.assignedStudents || !selectedRoomObj.assignedStudents[idx])
    : [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedHostel || !selectedBlock || !selectedFloor || !selectedRoom || selectedBed === "") {
      setMessage("Please select all fields.");
      return;
    }
    setMessage("");
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        withCredentials: true
      };
      const payload = {
        roomId: selectedRoom,
        bed: Number(selectedBed)
      };
      // Submit a room request for admin approval
      const res = await axios.post(`${API_BASE_URL}/room/requests`, payload, config);
      if (res.data && res.data.success) {
        setMessage("Room request submitted! Awaiting admin approval.");
        setSelectedHostel("");
        setSelectedBlock("");
        setSelectedFloor("");
        setSelectedRoom("");
        setSelectedBed("");
        if (onBook) onBook();
      } else {
        setMessage(res.data.message || "Failed to submit room request.");
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "Network error booking room.");
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <form onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-2xl border border-gray-200 w-full max-w-xl mx-auto">
        <h2 className="text-2xl font-bold mb-8 text-center text-gray-800">Book a Room 🏠</h2>
        {message && (
          <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded-lg relative mb-4 text-center">
            <span className="block">{message}</span>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Hostel Selection */}
          <div className="flex flex-col">
            <label htmlFor="hostel" className="mb-2 text-sm font-medium text-gray-700">Hostel</label>
            <select
              id="hostel"
              value={selectedHostel}
              onChange={e => {
                setSelectedHostel(e.target.value);
                setSelectedBlock("");
                setSelectedFloor("");
                setSelectedRoom("");
                setSelectedBed("");
              }}
              className="w-full border border-gray-300 rounded-lg p-2"
              required
            >
              <option value="">Select Hostel</option>
              {hostels.map(h => (
                <option key={h._id} value={h._id}>{h.name}</option>
              ))}
            </select>
          </div>
          {/* Block Selection */}
          <div className="flex flex-col">
            <label htmlFor="block" className="mb-2 text-sm font-medium text-gray-700">Block</label>
            <select
              id="block"
              value={selectedBlock}
              onChange={e => {
                setSelectedBlock(e.target.value);
                setSelectedFloor("");
                setSelectedRoom("");
                setSelectedBed("");
              }}
              className="w-full border border-gray-300 rounded-lg p-2"
              required
              disabled={!selectedHostel}
            >
              <option value="">Select Block</option>
              {blockOptions.map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>
          {/* Floor Selection */}
          <div className="flex flex-col">
            <label htmlFor="floor" className="mb-2 text-sm font-medium text-gray-700">Floor</label>
            <select
              id="floor"
              value={selectedFloor}
              onChange={e => {
                setSelectedFloor(e.target.value);
                setSelectedRoom("");
                setSelectedBed("");
              }}
              className="w-full border border-gray-300 rounded-lg p-2"
              required
              disabled={!selectedBlock}
            >
              <option value="">Select Floor</option>
              {floorOptions.map(f => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>
          {/* Room Selection */}
          <div className="flex flex-col">
            <label htmlFor="room" className="mb-2 text-sm font-medium text-gray-700">Room</label>
            <select
              id="room"
              value={selectedRoom}
              onChange={e => {
                setSelectedRoom(e.target.value);
                setSelectedBed("");
              }}
              className="w-full border border-gray-300 rounded-lg p-2"
              required
              disabled={!selectedFloor}
            >
              <option value="">Select Room</option>
              {filteredRooms.map(r => (
                <option key={r._id} value={r._id}>{r.roomNumber} (Beds: {r.capacity - (r.assignedStudents?.length || 0)} available)</option>
              ))}
            </select>
          </div>
          {/* Bed Selection */}
          <div className="flex flex-col">
            <label htmlFor="bed" className="mb-2 text-sm font-medium text-gray-700">Bed</label>
            <select
              id="bed"
              value={selectedBed}
              onChange={e => setSelectedBed(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2"
              required
              disabled={!selectedRoom}
            >
              <option value="">Select Bed</option>
              {availableBedIndices.map(idx => (
                <option key={idx} value={idx}>Bed {idx + 1}</option>
              ))}
            </select>
          </div>
        </div>
        <button
          type="submit"
          className="mt-8 w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition duration-300 shadow-md md:col-span-2"
          disabled={loading}
        >
          {loading ? "Booking..." : "Book Room"}
        </button>
      </form>
    </div>
  );
};

export default StudentRoomBooking;
