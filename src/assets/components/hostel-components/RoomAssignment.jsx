import React, { useEffect, useState } from "react";
import axios from "axios";
import RoomAssignmentForm from "./RoomAssignmentForm";
import CurrentAllocations from "./CurrentAllocationsMain";

const API_BASE = "http://localhost:5000/api"; // your backend URL

const RoomAssignment = () => {
  const [students, setStudents] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const [assignments, setAssignments] = useState([]);

  // ✅ Fetch Students
  const fetchStudents = async () => {
    try {
      const res = await axios.get(`${API_BASE}/students`);
      setStudents(res.data);
    } catch (error) {
      console.error("Error fetching students:", error.message);
    }
  };

  // ✅ Fetch Blocks/Rooms
  const fetchBlocks = async () => {
    try {
      const res = await axios.get(`${API_BASE}/blocks`);
      setBlocks(res.data);
    } catch (error) {
      console.error("Error fetching blocks:", error.message);
    }
  };

  // ✅ Fetch Current Assignments
  const fetchAssignments = async () => {
    try {
      const res = await axios.get(`${API_BASE}/assignments`);
      setAssignments(res.data);
    } catch (error) {
      console.error("Error fetching assignments:", error.message);
    }
  };

  useEffect(() => {
    fetchStudents();
    fetchBlocks();
    fetchAssignments();
  }, []);

  // ✅ Assign Room
  const handleAssign = async (payload) => {
    try {
      await axios.post(`${API_BASE}/assignments`, payload);
      fetchAssignments();
      alert("Room assigned successfully ✅");
    } catch (error) {
      console.error("Error assigning room:", error.message);
    }
  };

  // ✅ Unassign Room
  const handleUnassign = async (id) => {
    if (!window.confirm("Unassign this student from the room?")) return;
    try {
      await axios.delete(`${API_BASE}/assignments/${id}`);
      fetchAssignments();
    } catch (error) {
      console.error("Error unassigning:", error.message);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">🛏 Room Assignment</h2>

      <RoomAssignmentForm
        students={students}
        blocks={blocks}
        onAssign={handleAssign}
      />

      <CurrentAllocations
        assignments={assignments}
        onUnassign={handleUnassign}
      />
    </div>
  );
};

export default RoomAssignment;
