import React, { useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "@/config/api";

const HostelManager = () => {
  const [hostels, setHostels] = useState([]);
  const [formData, setFormData] = useState({ name: "", location: "", description: "" });
  const [editingHostel, setEditingHostel] = useState(null);

  // ✅ Fetch Hostels
  const fetchHostels = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/hostels`);
      setHostels(res.data);
    } catch (error) {
      console.error("Error fetching hostels:", error.message);
    }
  };

  // ✅ Handle Hostel Form Submit
  const handleHostelSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingHostel) {
        await axios.put(`${API_BASE_URL}/hostels/${editingHostel._id}`, formData);
      } else {
        await axios.post(`${API_BASE_URL}/hostels`, formData);
      }
      setFormData({ name: "", location: "", description: "" });
      setEditingHostel(null);
      fetchHostels();
    } catch (error) {
      console.error("Error saving hostel:", error.message);
    }
  };

  // ✅ Delete Hostel
  const deleteHostel = async (id) => {
    if (!window.confirm("Are you sure you want to delete this hostel?")) return;
    try {
      await axios.delete(`${API_BASE_URL}/hostels/${id}`);
      fetchHostels();
    } catch (error) {
      console.error("Error deleting hostel:", error.message);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">🏨 Hostel Management</h2>

      {/* Hostel Form */}
      <form
        onSubmit={handleHostelSubmit}
        className="flex gap-4 flex-wrap bg-gray-50 p-4 rounded-lg shadow mb-6"
      >
        <input
          type="text"
          placeholder="Hostel Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="border rounded p-2 flex-1"
          required
        />
        <input
          type="text"
          placeholder="Location"
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          className="border rounded p-2 flex-1"
          required
        />
        <input
          type="text"
          placeholder="Description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="border rounded p-2 flex-1"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          {editingHostel ? "Update Hostel" : "Add Hostel"}
        </button>
      </form>

      {/* Hostel Table */}
      <div className="overflow-x-auto mb-10">
        <table className="w-full border-collapse border border-gray-300 shadow">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-3">Name</th>
              <th className="border p-3">Location</th>
              <th className="border p-3">Description</th>
              <th className="border p-3">No of Rooms</th>
              <th className="border p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {hostels.map((h) => (
              <tr key={h._id} className="hover:bg-gray-50">
                <td className="border p-3">{h.name}</td>
                <td className="border p-3">{h.location}</td>
                <td className="border p-3">{h.description}</td>
                <td className="border p-3"></td>
                <td className="border p-3 flex gap-2">
                  <button
                    onClick={() => setEditingHostel(h) || setFormData(h)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteHostel(h._id)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {hostels.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center p-4 text-gray-500">
                  No hostels found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>    
    </div>
  );
};

export default HostelManager;
