import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "@/config/api";

const RoomAssignmentForm = ({ onAssign }) => {
  const [students, setStudents] = useState([]);
  const [hostels, setHostels] = useState([]);
  const [block, setBlock] = useState([]);
  const [floor, setFloor] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedHostel, setSelectedHostel] = useState("");
  const [selectedRoom, setSelectedRoom] = useState("");
  const [selectedBed, setSelectedBed] = useState("");
  const [selectedBlock, setSelectedBlock] = useState("");
  const [selectedFloor, setSelectedFloor] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch hostels and rooms from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
        const [hostelRes, roomRes, userRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/hostel`),
          axios.get(`${API_BASE_URL}/room`),
          axios.get(`${API_BASE_URL}/users`, config)
        ]);
        setHostels(hostelRes.data.data || []);
        setRooms(roomRes.data.data || []);
  // Filter only users with role 'student'
  setStudents((userRes.data || []).filter(u => u.role === 'student'));
      } catch (err) {
        console.log(err);
        setMessage("Failed to fetch hostels, rooms, or students");
      }
    };
    fetchData();
  }, []);

  // Filter rooms by selected hostel
  const filteredRooms = rooms.filter(r => r.hostelId && r.hostelId._id === selectedHostel);

  // For each room, calculate available beds
  const getAvailableBeds = (room) => {
    const assigned = Array.isArray(room.assignedStudents) ? room.assignedStudents.length : 0;
    return room.capacity - assigned;
  };

  // For selected room, get available bed indices
  const selectedRoomObj = rooms.find(r => r._id === selectedRoom);
  const availableBedIndices = selectedRoomObj
    ? Array.from({ length: selectedRoomObj.capacity })
        .map((_, idx) => idx)
        .filter(idx => !selectedRoomObj.assignedStudents || !selectedRoomObj.assignedStudents[idx])
    : [];

  if (!hostels.length || !rooms.length) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="text-xl font-medium text-gray-500">Loading...</div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedStudent || !selectedHostel || !selectedRoom || selectedBed === "") {
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
        studentId: selectedStudent,
        roomId: selectedRoom,
        bedIndex: Number(selectedBed)
      };
      const res = await axios.post(`${API_BASE_URL}/room/assign`, payload, config);
      if (res.data && res.data.success) {
        setMessage("Room assigned successfully!");
        setSelectedStudent("");
        setSelectedHostel("");
        setSelectedRoom("");
        setSelectedBed("");
        if (onAssign) onAssign();
      } else {
        setMessage(res.data.message || "Failed to assign room.");
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "Network error assigning room.");
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <form onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-2xl border border-gray-200 w-full max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">Assign a Room 🔑</h2>

        {message && (
          <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded-lg relative mb-4 text-center">
            <span className="block">{message}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Student Selection */}
          <div className="flex flex-col">
            <label htmlFor="student" className="mb-2 text-sm font-medium text-gray-700">Student</label>
            <select
              id="student"
              value={selectedStudent}
              onChange={e => setSelectedStudent(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2"
              required
            >
              <option value="">Select Student</option>
              {students.map(s => (
                <option key={s._id} value={s._id}>{s.firstName} {s.lastName}</option>
              ))}
            </select>
          </div>

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
            >
              <option value="">Select Block</option>
              {hostels.map(b => (
                <option key={b._id} value={b._id}>{b.name}</option>
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
            >
              <option value="">Select Floor</option>
              {hostels.map(f => (
                <option key={f._id} value={f._id}>{f.name}</option>
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
              disabled={!selectedHostel}
            >
              <option value="">Select Room</option>
              {filteredRooms.map(r => (
                getAvailableBeds(r) > 0 ? (
                  <option key={r._id} value={r._id}>{r.roomNumber} (Beds: {getAvailableBeds(r)} available)</option>
                ) : null
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
          {loading ? "Assigning..." : "Assign Room"}
        </button>
      </form>
    </div>
  );
};

export default RoomAssignmentForm;


