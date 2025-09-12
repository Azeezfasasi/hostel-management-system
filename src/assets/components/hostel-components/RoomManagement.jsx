import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "@/config/api";

const Modal = ({ children, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
      <div className="relative p-8 bg-white w-96 max-w-lg mx-auto rounded-md shadow-lg">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-2xl font-bold"
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

const RoomManager = () => {
  const [hostels, setHostels] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [roomData, setRoomData] = useState({
    hostel: "",
    floor: "",
    block: "",
    roomNumber: "",
    capacity: "",
    price: "",
  });
  const [editingRoom, setEditingRoom] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // New state for modal

  const fetchHostels = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/hostels`);
      setHostels(res.data);
    } catch (error) {
      console.error("Error fetching hostels:", error.message);
    }
  };

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

  const handleRoomSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingRoom) {
        await axios.put(`${API_BASE_URL}/rooms/${editingRoom._id}`, roomData);
      } else {
        await axios.post(`${API_BASE_URL}/rooms`, roomData);
      }
      setRoomData({
        hostel: "",
        floor: "",
        block: "",
        roomNumber: "",
        capacity: "",
        price: "",
      });
      setEditingRoom(null);
      fetchRooms();
      setIsModalOpen(false); // Close modal on successful submit
    } catch (error) {
      console.error("Error saving room:", error.message);
    }
  };

  const deleteRoom = async (id) => {
    if (!window.confirm("Are you sure you want to delete this room?")) return;
    try {
      await axios.delete(`${API_BASE_URL}/rooms/${id}`);
      fetchRooms();
    } catch (error) {
      console.error("Error deleting room:", error.message);
    }
  };

  const openAddRoomModal = () => {
    setEditingRoom(null); // Clear any previous editing state
    setRoomData({ hostel: "", floor: "", block: "", roomNumber: "", capacity: "", price: "" }); // Reset form
    setIsModalOpen(true);
  };

  const openEditRoomModal = (room) => {
    setEditingRoom(room);
    setRoomData({
      hostel: room.hostel?._id || "",
      roomNumber: room.roomNumber,
      capacity: room.capacity,
      price: room.price,
      floor: room.floor,
      block: room.block,
    });
    setIsModalOpen(true);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">🛏 Room Management</h2>
        <button
          onClick={openAddRoomModal}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Add Room
        </button>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h3 className="text-xl font-bold mb-4">
          {editingRoom ? "Edit Room" : "Add New Room"}
        </h3>
        {/* Room Form */}
        <form onSubmit={handleRoomSubmit} className="flex flex-col gap-4">
          <select
            value={roomData.hostel}
            onChange={(e) =>
              setRoomData({ ...roomData, hostel: e.target.value })
            }
            className="border rounded p-2"
            required
          >
            <option value="">Select Hostel</option>
            {hostels.map((h) => (
              <option key={h._id} value={h._id}>
                {h.name}
              </option>
            ))}
          </select>
          <select value={roomData.block} onChange={(e) => setRoomData({ ...roomData, block: e.target.value })} className="border rounded p-2" required>
            <option value="">Choose Block</option>
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
            <option value="D">D</option>
            <option value="E">E</option>
          </select>
          <select value={roomData.floor} onChange={(e) => setRoomData({ ...roomData, floor: e.target.value })} className="border rounded p-2" required>
            <option value="">Choose Floor</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
          <input
            type="text"
            placeholder="Room Number"
            value={roomData.roomNumber}
            onChange={(e) =>
              setRoomData({ ...roomData, roomNumber: e.target.value })
            }
            className="border rounded p-2"
            required
          />
          <select value={roomData.capacity} onChange={(e) => setRoomData({ ...roomData, capacity: e.target.value })} className="border rounded p-2" required>
            <option value="">Select Capacity</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
          <input
            type="number"
            placeholder="Price"
            value={roomData.price}
            onChange={(e) =>
              setRoomData({ ...roomData, price: e.target.value })
            }
            className="border rounded p-2"
            required
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            {editingRoom ? "Update Room" : "Add Room"}
          </button>
        </form>
      </Modal>

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
                    onClick={() => openEditRoomModal(r)}
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