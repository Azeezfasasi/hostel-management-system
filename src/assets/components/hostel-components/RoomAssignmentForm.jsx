import React, { useState, useEffect } from "react";

const RoomAssignmentForm = ({ students, hostels, onAssign }) => {
  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedHostel, setSelectedHostel] = useState("");
  const [selectedFloor, setSelectedFloor] = useState("");
  const [selectedRoom, setSelectedRoom] = useState("");
  const [selectedBed, setSelectedBed] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedStudent || !selectedHostel || !selectedFloor || !selectedRoom || !selectedBed) {
      setMessage("Please select all fields.");
      return;
    }
    setMessage("");
    onAssign({
      studentId: selectedStudent,
      hostelId: selectedHostel,
      floorId: selectedFloor,
      roomId: selectedRoom,
      bedIndex: selectedBed,
    });

    // Reset form
    setSelectedStudent("");
    setSelectedHostel("");
    setSelectedFloor("");
    setSelectedRoom("");
    setSelectedBed("");
  };

  // The guard check is essential to prevent the "Cannot read properties of undefined" error.
  // It ensures the component doesn't try to render the form until the data is available.
  if (!hostels || !Array.isArray(hostels)) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="text-xl font-medium text-gray-500">Loading...</div>
      </div>
    );
  }

  // Helper functions for conditional data fetching
  const selectedHostelData = hostels.find((h) => h._id === selectedHostel);
  const selectedFloorData = selectedHostelData?.floors.find((f) => f._id === selectedFloor);
  const selectedRoomData = selectedFloorData?.rooms.find((r) => r._id === selectedRoom);

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <form onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-2xl border border-gray-200 w-full max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">Assign a Room 🔑</h2>

        {message && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-4 text-center">
            <span className="block">{message}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Student Selection */}
          <div className="flex flex-col">
            <label htmlFor="student" className="mb-2 text-sm font-medium text-gray-700">Student</label>
            <div className="relative">
              <select
                id="student"
                value={selectedStudent}
                onChange={(e) => setSelectedStudent(e.target.value)}
                className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
                required
              >
                <option value="">Select Student</option>
                {students.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.firstName} {s.lastName}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
              </div>
            </div>
          </div>

          {/* Hostel Selection */}
          <div className="flex flex-col">
            <label htmlFor="hostel" className="mb-2 text-sm font-medium text-gray-700">Hostel</label>
            <div className="relative">
              <select
                id="hostel"
                value={selectedHostel}
                onChange={(e) => {
                  setSelectedHostel(e.target.value);
                  setSelectedFloor("");
                  setSelectedRoom("");
                  setSelectedBed("");
                }}
                className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
                required
              >
                <option value="">Select Hostel</option>
                {hostels.map((h) => (
                  <option key={h._id} value={h._id}>
                    {h.name}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
              </div>
            </div>
          </div>

          {/* Floor Selection */}
          <div className="flex flex-col">
            <label htmlFor="floor" className="mb-2 text-sm font-medium text-gray-700">Floor</label>
            <div className="relative">
              <select
                id="floor"
                value={selectedFloor}
                onChange={(e) => {
                  setSelectedFloor(e.target.value);
                  setSelectedRoom("");
                  setSelectedBed("");
                }}
                className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white disabled:bg-gray-100 disabled:text-gray-400"
                required
                disabled={!selectedHostel}
              >
                <option value="">Select Floor</option>
                {selectedHostelData?.floors.map((f) => (
                  <option key={f._id} value={f._id}>
                    {f.name}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5a2 2 0 01-2-2V7a2 2 0 012-2h14a2 2 0 012 2v2a2 2 0 01-2 2zM14 15h2m-2 4h2m-2-4v2m-2 2v-2m0-2v-2m0 0H5"></path></svg>
              </div>
            </div>
          </div>

          {/* Room Selection */}
          <div className="flex flex-col">
            <label htmlFor="room" className="mb-2 text-sm font-medium text-gray-700">Room</label>
            <div className="relative">
              <select
                id="room"
                value={selectedRoom}
                onChange={(e) => {
                  setSelectedRoom(e.target.value);
                  setSelectedBed("");
                }}
                className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white disabled:bg-gray-100 disabled:text-gray-400"
                required
                disabled={!selectedFloor}
              >
                <option value="">Select Room</option>
                {selectedFloorData?.rooms.map((r) => (
                  <option key={r._id} value={r._id}>
                    {r.name}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5a2 2 0 01-2-2V7a2 2 0 012-2h14a2 2 0 012 2v2a2 2 0 01-2 2zM14 15h2m-2 4h2m-2-4v2m-2 2v-2m0-2v-2m0 0H5"></path></svg>
              </div>
            </div>
          </div>

          {/* Bed Selection */}
          <div className="flex flex-col">
            <label htmlFor="bed" className="mb-2 text-sm font-medium text-gray-700">Bed</label>
            <div className="relative">
              <select
                id="bed"
                value={selectedBed}
                onChange={(e) => setSelectedBed(e.target.value)}
                className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white disabled:bg-gray-100 disabled:text-gray-400"
                required
                disabled={!selectedRoom}
              >
                <option value="">Select Bed</option>
                {selectedRoomData?.beds.map((bed, i) =>
                  bed === "available" ? (
                    <option key={i} value={i}>
                      Bed {i + 1}
                    </option>
                  ) : null
                )}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21h-2a2 2 0 01-2-2v-2a2 2 0 012-2h2m0 4a2 2 0 00-2-2m2 2h2v2h-2m-4-2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2a2 2 0 012-2h2a2 2 0 012 2v2z"></path></svg>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="mt-8 w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition duration-300 shadow-md md:col-span-2"
        >
          Assign Room
        </button>
      </form>
    </div>
  );
};

// This is the parent component that manages state and fetches data.
const mockStudents = [
  { _id: "s1", firstName: "Alice", lastName: "Smith" },
  { _id: "s2", firstName: "Bob", lastName: "Johnson" },
];

const mockHostels = [
  {
    _id: "h1",
    name: "Hostel A",
    floors: [
      {
        _id: "f1",
        name: "Floor 1",
        rooms: [
          { _id: "r1", name: "Room 101", beds: ["available", "assigned", "available"] },
          { _id: "r2", name: "Room 102", beds: ["assigned", "assigned", "available"] },
        ],
      },
      {
        _id: "f2",
        name: "Floor 2",
        rooms: [
          { _id: "r3", name: "Room 201", beds: ["available", "available"] },
        ],
      },
    ],
  },
  {
    _id: "h2",
    name: "Hostel B",
    floors: [
      {
        _id: "f3",
        name: "Floor 1",
        rooms: [
          { _id: "r4", name: "Room 101", beds: ["available", "available", "available", "available"] },
        ],
      },
    ],
  },
];

export default function App() {
  const [students, setStudents] = useState([]);
  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(true);

  // Simulate data fetching from an API
  useEffect(() => {
    setTimeout(() => {
      setStudents(mockStudents);
      setHostels(mockHostels);
      setLoading(false);
    }, 1500); // Simulate a 1.5-second network delay
  }, []);

  const handleAssign = (assignment) => {
    console.log("Assignment:", assignment);
    // Here you would typically send the assignment to a database or API
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="text-xl font-medium text-gray-500 animate-pulse">Loading data...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12">
      <RoomAssignmentForm
        students={students}
        hostels={hostels}
        onAssign={handleAssign}
      />
    </div>
  );
}
