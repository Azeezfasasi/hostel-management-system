import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "@/config/api";

const StudentRoomBooking = () => {
  const [hostels, setHostels] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [selectedCampus, setSelectedCampus] = useState("");
  const [selectedHostel, setSelectedHostel] = useState("");
  const [selectedBlock, setSelectedBlock] = useState("");
  const [selectedFloor, setSelectedFloor] = useState("");
  const [selectedRoom, setSelectedRoom] = useState("");
  const [selectedBed, setSelectedBed] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);

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

  // Get unique campus options from hostels
  const campusOptions = Array.from(new Set(hostels.map(h => h.hostelCampus).filter(Boolean)));

  // Filter hostels by selected campus
  const filteredHostels = selectedCampus
    ? hostels.filter(h => h.hostelCampus === selectedCampus)
    : hostels;

  // Get unique blocks for selected hostel (filtered by campus)
  const blockOptions = Array.from(new Set(
    rooms
      .filter(r => r.hostelId &&
        (!selectedCampus || r.hostelId.hostelCampus === selectedCampus) &&
        r.hostelId._id === selectedHostel)
      .map(r => r.roomBlock)
      .filter(Boolean)
  ));

  // Get unique floors for selected hostel and block (filtered by campus)
  const floorOptions = Array.from(new Set(
    rooms
      .filter(r => r.hostelId &&
        (!selectedCampus || r.hostelId.hostelCampus === selectedCampus) &&
        r.hostelId._id === selectedHostel &&
        (!selectedBlock || r.roomBlock === selectedBlock))
      .map(r => r.roomFloor)
      .filter(Boolean)
  ));

  // Filter rooms by selected campus, hostel, block, and floor, and only show rooms with available beds
  const filteredRooms = rooms.filter(r =>
    r.hostelId &&
    (!selectedCampus || r.hostelId.hostelCampus === selectedCampus) &&
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

  const handlePayment = async (amount, bookingId) => {
    setPaymentLoading(true);
    try {
      const token = localStorage.getItem("token");
      const studentId = localStorage.getItem("studentId");
      const studentEmail = localStorage.getItem("studentEmail");
      const studentFirstName = localStorage.getItem("studentFirstName") || "Student";
      const studentLastName = localStorage.getItem("studentLastName") || "";
      const studentPhone = localStorage.getItem("studentPhone") || "";
      const reference = Math.random().toString(36).substring(2, 22);
      // Call backend to get Credo authorizationUrl
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
          metadata: { bookingId }
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data?.status === "success" && data.data?.authorizationUrl) {
        window.location.href = data.data.authorizationUrl;
      } else {
        setMessage("Failed to start payment.");
      }
    } catch (err) {
      console.log(err);
      setMessage("Error starting payment.");
    }
    setPaymentLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedHostel || !selectedBlock || !selectedFloor || !selectedRoom || selectedBed === "") {
      setMessage("Please select all fields.");
      return;
    }
    setMessage("");
    setLoading(true);
    const token = localStorage.getItem("token");
    const studentId = localStorage.getItem("studentId");
    // Get room price from selectedRoomObj or set a fixed price
    const amount = selectedRoomObj?.price || 50000; // Example price
    try {
      // Step 1: Create booking
      const bookingRes = await axios.post(
        `${API_BASE_URL}/room/requests`,
        {
          roomId: selectedRoom,
          bed: Number(selectedBed),
          student: studentId
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const bookingId = bookingRes.data?.data?._id;
      if (bookingId) {
        // Step 2: Initiate payment
        await handlePayment(amount, bookingId);
      } else {
        setMessage("Booking failed. Please try again.");
      }
    } catch (err) {
      console.log(err);
      setMessage("Booking or payment failed.");
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
          {/* Campus Selection */}
          <div className="flex flex-col">
            <label htmlFor="campus" className="mb-2 text-sm font-medium text-gray-700">Campus</label>
            <select
              id="campus"
              value={selectedCampus}
              onChange={e => {
                setSelectedCampus(e.target.value);
                setSelectedHostel("");
                setSelectedBlock("");
                setSelectedFloor("");
                setSelectedRoom("");
                setSelectedBed("");
              }}
              className="w-full border border-gray-300 rounded-lg p-2"
              required
            >
              <option value="">Select Campus</option>
              {campusOptions.map(c => (
                <option key={c} value={c}>{c}</option>
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
              disabled={!selectedCampus}
            >
              <option value="">Select Hostel</option>
              {filteredHostels.map(h => (
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
        {/* Show room price if a room is selected */}
        {selectedRoomObj && (
          <div className="mt-6 text-lg font-semibold text-center text-gray-800">
            Room Price: <span className="text-blue-600">₦{selectedRoomObj.price?.toLocaleString('en-NG')}</span>
          </div>
        )}
        <button
          type="submit"
          className="mt-8 w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition duration-300 shadow-md md:col-span-2"
          disabled={loading || paymentLoading}
        >
          {loading || paymentLoading ? "Processing..." : "Book & Pay"}
        </button>
      </form>
    </div>
  );
};

export default StudentRoomBooking;
