import React, { useState } from "react";

const RoomAssignmentForm = ({ students, blocks, onAssign }) => {
  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedBlock, setSelectedBlock] = useState("");
  const [selectedFloor, setSelectedFloor] = useState("");
  const [selectedRoom, setSelectedRoom] = useState("");
  const [selectedBed, setSelectedBed] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedStudent || !selectedBlock || !selectedFloor || !selectedRoom || !selectedBed) {
      alert("Please select all fields");
      return;
    }
    onAssign({
      student: selectedStudent,
      block: selectedBlock,
      floor: selectedFloor,
      room: selectedRoom,
      bed: selectedBed,
    });

    // reset form
    setSelectedStudent("");
    setSelectedBlock("");
    setSelectedFloor("");
    setSelectedRoom("");
    setSelectedBed("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-6 rounded-lg shadow mb-10"
    >
      {/* Student */}
      <select
        value={selectedStudent}
        onChange={(e) => setSelectedStudent(e.target.value)}
        className="border rounded p-2"
        required
      >
        <option value="">Select Student</option>
        {/* {students.map((s) => (
          <option key={s._id} value={s._id}>
            {s.firstName} {s.lastName}
          </option>
        ))} */}
      </select>

      {/* Block */}
      <select
        value={selectedBlock}
        onChange={(e) => {
          setSelectedBlock(e.target.value);
          setSelectedFloor("");
          setSelectedRoom("");
          setSelectedBed("");
        }}
        className="border rounded p-2"
        required
      >
        <option value="">Select Block</option>
        {/* {blocks.map((b) => (
          <option key={b._id} value={b._id}>
            {b.name}
          </option>
        ))} */}
      </select>

      {/* Floor */}
      <select
        value={selectedFloor}
        onChange={(e) => {
          setSelectedFloor(e.target.value);
          setSelectedRoom("");
          setSelectedBed("");
        }}
        className="border rounded p-2"
        required
        disabled={!selectedBlock}
      >
        <option value="">Select Floor</option>
        {selectedBlock &&
          blocks.find((b) => b._id === selectedBlock)?.floors.map((f) => (
            <option key={f._id} value={f._id}>
              {f.name}
            </option>
          ))}
      </select>

      {/* Room */}
      <select
        value={selectedRoom}
        onChange={(e) => {
          setSelectedRoom(e.target.value);
          setSelectedBed("");
        }}
        className="border rounded p-2"
        required
        disabled={!selectedFloor}
      >
        <option value="">Select Room</option>
        {selectedFloor &&
          blocks
            .flatMap((b) => b.floors)
            .find((f) => f._id === selectedFloor)
            ?.rooms.map((r) => (
              <option key={r._id} value={r._id}>
                {r.name}
              </option>
            ))}
      </select>

      {/* Bed */}
      <select
        value={selectedBed}
        onChange={(e) => setSelectedBed(e.target.value)}
        className="border rounded p-2"
        required
        disabled={!selectedRoom}
      >
        <option value="">Select Bed</option>
        {selectedRoom &&
          blocks
            .flatMap((b) => b.floors)
            .flatMap((f) => f.rooms)
            .find((r) => r._id === selectedRoom)
            ?.beds.map((bed, i) =>
              bed === "available" ? (
                <option key={i} value={i}>
                  Bed {i + 1}
                </option>
              ) : null
            )}
      </select>

      <button
        type="submit"
        className="col-span-1 md:col-span-2 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
      >
        Assign Room
      </button>
    </form>
  );
};

export default RoomAssignmentForm;
