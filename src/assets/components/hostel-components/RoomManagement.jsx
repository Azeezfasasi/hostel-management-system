import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "@/config/api";

const RoomManager = () => {
  const [hostels, setHostels] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [roomData, setRoomData] = useState({ hostel: "", roomNumber: "", capacity: "", price: "" });
  const [editingRoom, setEditingRoom] = useState(null);

  // ✅ Fetch Hostels
  const fetchHostels = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/hostels`);
      setHostels(res.data);
    } catch (error) {
      console.error("Error fetching hostels:", error.message);
    }
  };

  // ✅ Fetch Rooms
  const fetchRooms = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/rooms`);
      setRooms(res.data);
    } catch (error) {
      console.error("Error fetching rooms:", error.message);
    }
  };

  useEffect(() => {
    fetchHostels();
    fetchRooms();
  }, []);

  // ✅ Handle Room Form Submit
  const handleRoomSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingRoom) {
        await axios.put(`${API_BASE_URL}/rooms/${editingRoom._id}`, roomData);
      } else {
        await axios.post(`${API_BASE_URL}/rooms`, roomData);
      }
      setRoomData({ hostel: "", roomNumber: "", capacity: "", price: "" });
      setEditingRoom(null);
      fetchRooms();
    } catch (error) {
      console.error("Error saving room:", error.message);
    }
  };

  // ✅ Delete Room
  const deleteRoom = async (id) => {
    if (!window.confirm("Are you sure you want to delete this room?")) return;
    try {
      await axios.delete(`${API_BASE_URL}/rooms/${id}`);
      fetchRooms();
    } catch (error) {
      console.error("Error deleting room:", error.message);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">🛏 Room Management</h2>

      {/* Room Form */}
      <form
        onSubmit={handleRoomSubmit}
        className="flex gap-4 flex-wrap bg-gray-50 p-4 rounded-lg shadow mb-6"
      >
        <select
          value={roomData.hostel}
          onChange={(e) => setRoomData({ ...roomData, hostel: e.target.value })}
          className="border rounded p-2 flex-1"
          required
        >
          <option value="">Select Hostel</option>
          {hostels.map((h) => (
            <option key={h._id} value={h._id}>
              {h.name}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Room Number"
          value={roomData.roomNumber}
          onChange={(e) => setRoomData({ ...roomData, roomNumber: e.target.value })}
          className="border rounded p-2 flex-1"
          required
        />
        <input
          type="number"
          placeholder="Capacity"
          value={roomData.capacity}
          onChange={(e) => setRoomData({ ...roomData, capacity: e.target.value })}
          className="border rounded p-2 flex-1"
          required
        />
        <input
          type="number"
          placeholder="Price"
          value={roomData.price}
          onChange={(e) => setRoomData({ ...roomData, price: e.target.value })}
          className="border rounded p-2 flex-1"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          {editingRoom ? "Update Room" : "Add Room"}
        </button>
      </form>

      {/* Room Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300 shadow">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-3">Hostel</th>
              <th className="border p-3">Room Number</th>
              <th className="border p-3">Capacity</th>
              <th className="border p-3">Price</th>
              <th className="border p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rooms.map((r) => (
              <tr key={r._id} className="hover:bg-gray-50">
                <td className="border p-3">{r.hostel?.name || "N/A"}</td>
                <td className="border p-3">{r.roomNumber}</td>
                <td className="border p-3">{r.capacity}</td>
                <td className="border p-3">{r.price}</td>
                <td className="border p-3 flex gap-2">
                  <button
                    onClick={() =>
                      setEditingRoom(r) ||
                      setRoomData({
                        hostel: r.hostel?._id || "",
                        roomNumber: r.roomNumber,
                        capacity: r.capacity,
                        price: r.price,
                      })
                    }
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteRoom(r._id)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {rooms.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center p-4 text-gray-500">
                  No rooms found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RoomManager;
