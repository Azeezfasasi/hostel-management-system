import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "@/config/api";
import { PencilLine, Trash2, Eye, Bed, CircleX } from 'lucide-react';
import { useUser } from "@/assets/context-api/user-context/UseUser";


const Modal = ({ children, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
      <div className="relative p-8 bg-white w-96 max-w-lg mx-auto rounded-md shadow-lg">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-red-600 hover:text-red-700 font-bold cursor-pointer"
        >
          <CircleX className="w-10 h-10" />
        </button>
        {children}
      </div>
    </div>
  );
};

const RoomManager = () => {
  const [hostels, setHostels] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [hostelFilter, setHostelFilter] = useState("");
  const [blockFilter, setBlockFilter] = useState("");
  const [floorFilter, setFloorFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const roomsPerPage = 10;
  const [roomData, setRoomData] = useState({
    hostelId: "",
    roomFloor: "",
    roomBlock: "",
    roomNumber: "",
    capacity: "",
    price: "",
  });
  const [editingRoom, setEditingRoom] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // View details modal state
  const [viewRoom, setViewRoom] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const { isSuperAdmin } = useUser();

  // Fetch hostels from backend (public route)
  const fetchHostels = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/hostel`);
      setHostels(res.data.data || []);
    } catch (error) {
      console.error("Error fetching hostels:", error.message);
    }
  };

  // Fetch rooms from backend (public route)
  const fetchRooms = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/room`);
      setRooms(res.data.data || []);
    } catch (error) {
      console.error("Error fetching rooms:", error.message);
    }
  };

  useEffect(() => {
    fetchHostels();
    fetchRooms();
  }, []);

  // Handle create/update room (protected route)
  const handleRoomSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        withCredentials: true
      };
      if (editingRoom) {
        await axios.put(`${API_BASE_URL}/room/${editingRoom._id}`, roomData, config);
      } else {
        await axios.post(`${API_BASE_URL}/room`, roomData, config);
      }
      setRoomData({
        hostelId: "",
        roomFloor: "",
        roomBlock: "",
        roomNumber: "",
        capacity: "",
        price: "",
      });
      setEditingRoom(null);
      fetchRooms();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving room:", error.message);
    }
  };

  // Handle delete room (protected route)
  const deleteRoom = async (id) => {
    if (!window.confirm("Are you sure you want to delete this room?")) return;
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        withCredentials: true
      };
      await axios.delete(`${API_BASE_URL}/room/${id}`, config);
      fetchRooms();
    } catch (error) {
      console.error("Error deleting room:", error.message);
    }
  };

  const openAddRoomModal = () => {
    setEditingRoom(null); // Clear any previous editing state
    setRoomData({ hostelId: "", roomFloor: "", roomBlock: "", roomNumber: "", capacity: "", price: "" }); // Reset form
    setIsModalOpen(true);
  };

  const openEditRoomModal = (room) => {
    setEditingRoom(room);
    setRoomData({
      hostelId: room.hostelId?._id || "",
      roomNumber: room.roomNumber,
      capacity: room.capacity,
      price: room.price,
      roomFloor: room.roomFloor,
      roomBlock: room.roomBlock,
    });
    setIsModalOpen(true);
  };

  // Filter options
  const hostelOptions = Array.from(new Set(hostels.map(h => h.name)));
  const blockOptions = Array.from(new Set(rooms.map(r => r.roomBlock).filter(Boolean)));
  const floorOptions = Array.from(new Set(rooms.map(r => r.roomFloor).filter(Boolean)));

  // Filtered rooms
  const filteredRooms = rooms.filter(r => {
    const hostelMatch = !hostelFilter || r.hostelId?.name === hostelFilter;
    const blockMatch = !blockFilter || r.roomBlock === blockFilter;
    const floorMatch = !floorFilter || r.roomFloor === floorFilter;
    // Optionally filter by hostelCampus if you add a filter
    return hostelMatch && blockMatch && floorMatch;
  });

  // Pagination
  const indexOfLastRoom = currentPage * roomsPerPage;
  const indexOfFirstRoom = indexOfLastRoom - roomsPerPage;
  const currentRooms = filteredRooms.slice(indexOfFirstRoom, indexOfLastRoom);
  const totalPages = Math.ceil(filteredRooms.length / roomsPerPage);

  // Helper to format price
  const formatPrice = (price) => {
    if (typeof price !== 'number') return price;
    return price.toLocaleString('en-NG');
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row gap-4 md:gap-0 justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">🛏 Room Management</h2>
        {isSuperAdmin && (
          <button
            onClick={openAddRoomModal}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Add Room
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <select value={hostelFilter} onChange={e => { setHostelFilter(e.target.value); setCurrentPage(1); }} className="border rounded p-2">
          <option value="">All Hostels</option>
          {hostelOptions.map(h => <option key={h} value={h}>{h}</option>)}
        </select>
        <select value={blockFilter} onChange={e => { setBlockFilter(e.target.value); setCurrentPage(1); }} className="border rounded p-2">
          <option value="">All Blocks</option>
          {blockOptions.map(b => <option key={b} value={b}>{b}</option>)}
        </select>
        <select value={floorFilter} onChange={e => { setFloorFilter(e.target.value); setCurrentPage(1); }} className="border rounded p-2">
          <option value="">All Floors</option>
          {floorOptions.map(f => <option key={f} value={f}>{f}</option>)}
        </select>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h3 className="text-xl font-bold mb-4">
          {editingRoom ? "Edit Room" : "Add New Room"}
        </h3>
        {/* Room Form */}
        <form onSubmit={handleRoomSubmit} className="flex flex-col gap-4">
          {/* ...existing code... */}
          <div  className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Choose Hostel</label>
            <select
              value={roomData.hostelId}
              onChange={(e) =>
                setRoomData({ ...roomData, hostelId: e.target.value })
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
          </div>
          {/* ...existing code... */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Block</label>
            <select value={roomData.roomBlock} onChange={(e) => setRoomData({ ...roomData, roomBlock: e.target.value })} className="border rounded p-2" required>
              <option value="">Choose Block</option>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
              <option value="D">D</option>
              <option value="E">E</option>
            </select>
          </div>
          {/* ...existing code... */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Floor</label>
            <select value={roomData.roomFloor} onChange={(e) => setRoomData({ ...roomData, roomFloor: e.target.value })} className="border rounded p-2" required>
              <option value="">Choose Floor</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
          </div>
          {/* ...existing code... */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Room Number <span className="text-blue-500 text-[12px]">(Enter a number between 1 and 100)</span></label>
            <input
              type="number"
              placeholder="Room Number"
              value={roomData.roomNumber}
              onChange={(e) =>
                setRoomData({ ...roomData, roomNumber: e.target.value })
              }
              className="border rounded p-2"
              required
            />
          </div>
          {/* ...existing code... */}
          <div  className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Room Capacity</label>
            <select value={roomData.capacity} onChange={(e) => setRoomData({ ...roomData, capacity: e.target.value })} className="border rounded p-2" required>
              <option value="">Select Capacity</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
              <option value="9">9</option>
              <option value="10">10</option>
            </select>
          </div>
          {/* ...existing code... */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Price</label>
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
          </div>
          {/* ...existing code... */}
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
              <th className="border p-3">Campus</th>
              <th className="border p-3">Hostel</th>
              <th className="border p-3">Block</th>
              <th className="border p-3">Floor</th>
              <th className="border p-3">Room Number</th>
              <th className="border p-3">Capacity</th>
              <th className="border p-3">Price</th>
              <th className="border p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentRooms.map((r) => (
              <React.Fragment key={r._id}>
                <tr className="hover:bg-gray-50">
                  <td className="border p-3">{r.hostelId?.hostelCampus || "N/A"}</td>
                  <td className="border p-3">{r.hostelId?.name || "N/A"}</td>
                  <td className="border p-3">Block {r.roomBlock}</td>
                  <td className="border p-3">Floor {r.roomFloor}</td>
                  <td className="border p-3">Room {r.roomNumber}</td>
                  <td className="border p-3">{r.capacity}</td>
                  <td className="border p-3">₦{formatPrice(r.price)}</td>
                  <td className="border border-solid border-gray-500 p-3 flex gap-2">
                    <button
                      onClick={() => { setViewRoom(r); setIsViewModalOpen(true); }}
                      className="bg-blue-500 text-white px-3 py-3 rounded hover:bg-blue-600 cursor-pointer border-none"
                    >
                      <Eye className="w-4 4- 4md:w-6 md:h-6" />
                    </button>
                    {isSuperAdmin && (
                    <button
                      onClick={() => openEditRoomModal(r)}
                      className="bg-yellow-500 text-white px-3 py-2 rounded hover:bg-yellow-600 cursor-pointer border-none"
                    >
                      <PencilLine className="w-4 4- 4md:w-6 md:h-6" />
                    </button>
                    )}
                    {isSuperAdmin && (
                    <button
                      onClick={() => deleteRoom(r._id)}
                      className="bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700 cursor-pointer border-none"
                    >
                      <Trash2 className="w-4 4- 4md:w-6 md:h-6" />
                    </button>
                    )}
                  </td>
                </tr>
              </React.Fragment>
            ))}
            {currentRooms.length === 0 && (
              <tr>
                <td colSpan="8" className="text-center p-4 text-gray-500">
                  No rooms found
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {/* View Details Modal */}
        <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)}>
          {viewRoom && (
            <div>
              <h3 className="text-xl font-bold mb-4">Room {viewRoom.roomNumber} Details</h3>
              
              <div className="flex gap-8 mb-4 justify-center">
                <span className="flex gap-2 font-semibold text-red-600 text-[30px] items-center">
                  <Bed className="w-8 h-8" /> 
                  {Array.isArray(viewRoom.assignedStudents) ? viewRoom.assignedStudents.filter(Boolean).length : 0}
                </span>
                <span className="flex gap-2 font-semibold text-green-600 text-[30px] items-center">
                  <Bed className="w-8 h-8" /> 
                  {viewRoom.capacity - (Array.isArray(viewRoom.assignedStudents) ? viewRoom.assignedStudents.filter(Boolean).length : 0)}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-2 mb-4">
                <div><span className="font-semibold">Campus:</span> {viewRoom.hostelId?.hostelCampus || "N/A"}</div>
                <div><span className="font-semibold">Hostel:</span> {viewRoom.hostelId?.name || "N/A"}</div>
                <div><span className="font-semibold">Block:</span> {viewRoom.roomBlock}</div>
                <div><span className="font-semibold">Floor:</span> {viewRoom.roomFloor}</div>
                <div><span className="font-semibold">Room Number:</span> {viewRoom.roomNumber}</div>
                <div><span className="font-semibold">Capacity:</span> {viewRoom.capacity}</div>
                <div><span className="font-semibold">Price:</span> ₦{formatPrice(viewRoom.price)}</div>
              </div>
              <div className="mb-2">
                <span className="font-semibold text-blue-600">Total Capacity:</span> {viewRoom.capacity}
              </div>
              <div className="mb-2">
                <span className="font-semibold text-red-600">Occupied Beds:</span> {Array.isArray(viewRoom.assignedStudents) ? viewRoom.assignedStudents.filter(Boolean).length : 0}
              </div>
              <div className="mb-2">
                <span className="font-semibold text-green-600">Available Beds:</span> {viewRoom.capacity - (Array.isArray(viewRoom.assignedStudents) ? viewRoom.assignedStudents.filter(Boolean).length : 0)}
              </div>

              {/* List of assigned students */}
              <div className="mt-4 border-t pt-2">
                <span className="font-semibold text-[20px]">Assigned Students:</span>
                {Array.isArray(viewRoom.assignedStudents) && viewRoom.assignedStudents.filter(Boolean).length > 0 ? (
                  <ul className="mt-2 list-disc list-inside">
                    {viewRoom.assignedStudents.map((student, idx) => (
                      student && typeof student === 'object' ? (
                        <li key={student._id || idx} className="mb-1">
                          {student.firstName} {student.lastName} ({student.matricNumber})
                        </li>
                      ) : null
                    ))}
                  </ul>
                ) : (
                  <div className="mt-2 text-gray-500">No students assigned to this room.</div>
                )}
              </div>
            </div>
          )}
        </Modal>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 gap-2">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded border bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
          >
            Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded border ${currentPage === i + 1 ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded border bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default RoomManager;