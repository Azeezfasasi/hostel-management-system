import React, { useState, useEffect } from "react";
import close from '../../images/close.svg';
import { API_BASE_URL } from "@/config/api";

const Modal = ({ children, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="relative bg-white w-full max-w-xl mx-auto rounded-xl shadow-2xl p-6 md:p-8">
        <button
          onClick={onClose}
          className="absolute top-8 right-8 text-red-600 hover:text-red-700 transition-colors"
          aria-label="Close"
        >
          <img src={close} alt="close" className="w-10 h-10 cursor-pointer" />
        </button>
        <div className="mt-12 max-h-[90vh] overflow-y-auto py-6 flex flex-col">
          {children}
        </div>
      </div>
    </div>
  );
};

const ConfirmationModal = ({ isOpen, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-[100] p-4">
      <div className="bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full text-center">
        <p className="text-lg font-medium mb-6 text-gray-800">{message}</p>
        <div className="flex justify-center space-x-4">
          <button
            onClick={onCancel}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default function HostelManager() {
  const [hostels, setHostels] = useState([]);
  const [formData, setFormData] = useState({ name: "", block: "", floor: "", location: "", description: "", genderRestriction: "", rulesAndPolicies: "", facilities: "" });
  const [editingHostel, setEditingHostel] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [hostelToDelete, setHostelToDelete] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch all hostels from backend
  const fetchHostels = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE_URL}/hostel`);
      const data = await res.json();
      if (data.success) {
        setHostels(data.data);
      } else {
        setError(data.message || "Failed to fetch hostels");
      }
    } catch {
      setError("Network error fetching hostels");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchHostels();
  }, []);

  // Handle Hostel Form Submit (Create or Update)
  const handleHostelSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    // Convert facilities to array (split by comma)
    const facilitiesArr = formData.facilities
      ? formData.facilities.split(",").map(f => f.trim()).filter(Boolean)
      : [];
    const payload = { ...formData, facilities: facilitiesArr };

    try {
      // Get JWT token from localStorage
      const token = localStorage.getItem('token');
      let res, data;
      const headers = {
        "Content-Type": "application/json",
        ...(token ? { "Authorization": `Bearer ${token}` } : {})
      };
      if (editingHostel) {
        // Update
        res = await fetch(`${API_BASE_URL}/hostel/${editingHostel._id}`, {
          method: "PUT",
          headers,
          body: JSON.stringify(payload),
          credentials: "include"
        });
      } else {
        // Create
        res = await fetch(`${API_BASE_URL}/hostel`, {
          method: "POST",
          headers,
          body: JSON.stringify(payload),
          credentials: "include"
        });
      }
      data = await res.json();
      if (data.success) {
        fetchHostels();
        setFormData({ name: "", block: "", floor: "", location: "", description: "", genderRestriction: "", rulesAndPolicies: "", facilities: "" });
        setEditingHostel(null);
        setIsModalOpen(false);
      } else {
        setError(data.message || "Failed to save hostel");
      }
    } catch {
      setError("Network error saving hostel");
    }
    setLoading(false);
  };

  // Delete Hostel with a custom confirmation modal
  const handleDeleteClick = (id) => {
    setHostelToDelete(id);
    setIsConfirmModalOpen(true);
  };

  const confirmDelete = async () => {
    setLoading(true);
    setError("");
    try {
      // Get JWT token from localStorage
      const token = localStorage.getItem('token');
      const headers = token ? { "Authorization": `Bearer ${token}` } : {};
      const res = await fetch(`${API_BASE_URL}/hostel/${hostelToDelete}`, {
        method: "DELETE",
        headers,
        credentials: "include"
      });
      const data = await res.json();
      if (data.success) {
        fetchHostels();
        setHostelToDelete(null);
        setIsConfirmModalOpen(false);
      } else {
        setError(data.message || "Failed to delete hostel");
      }
    } catch {
      setError("Network error deleting hostel");
    }
    setLoading(false);
  };

  const openAddHostelModal = () => {
    setEditingHostel(null);
    setFormData({ name: "", block: "", floor: "", location: "", description: "", genderRestriction: "", rulesAndPolicies: "", facilities: "" });
    setIsModalOpen(true);
    setError("");
  };

  const openEditHostelModal = (hostel) => {
    setEditingHostel(hostel);
    setFormData({
      ...hostel,
      facilities: Array.isArray(hostel.facilities) ? hostel.facilities.join(", ") : hostel.facilities || ""
    });
    setIsModalOpen(true);
    setError("");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 font-sans">
      <div className="p-6 max-w-6xl mx-auto bg-white rounded-xl shadow-lg border border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">🏨 Hostel Management</h2>
          <button
            onClick={openAddHostelModal}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Add Hostel
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg border border-red-300">
            {error}
          </div>
        )}
        {loading && (
          <div className="mb-4 p-3 bg-blue-100 text-blue-700 rounded-lg border border-blue-300">
            Loading...
          </div>
        )}

        {/* Modal for adding/editing hostels */}
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <h3 className="text-2xl font-bold mb-6 text-gray-800">
            {editingHostel ? "Edit Hostel" : "Add New Hostel"}
          </h3>
          <form onSubmit={handleHostelSubmit} className="flex flex-col gap-5 px-6">
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">Hostel Name</label>
              <input
                type="text"
                placeholder="Hostel Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">Block</label>
                <select
                  name="block"
                  value={formData.block}
                  onChange={(e) => setFormData({ ...formData, block: e.target.value })}
                  className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Choose Block</option>
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                  <option value="D">D</option>
                  <option value="E">E</option>
                </select>
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">Floor</label>
                <select
                  name="floor"
                  value={formData.floor}
                  onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
                  className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Choose Floor</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                  <option value="6">6</option>
                </select>
              </div>
            </div>
            
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">Gender Restriction</label>
              <select
                name="genderRestriction"
                value={formData.genderRestriction}
                onChange={(e) => setFormData({ ...formData, genderRestriction: e.target.value })}
                className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Choose Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="mixed">Mixed</option>
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">Location</label>
              <input
                type="text"
                placeholder="Location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea placeholder="Description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="border border-gray-300 rounded-lg p-3 h-24 focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">Rules and Policies</label>
              <textarea placeholder="Rules and Policies" value={formData.rulesAndPolicies} onChange={(e) => setFormData({ ...formData, rulesAndPolicies: e.target.value })} className="border border-gray-300 rounded-lg p-3 h-24 focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">Facilities <span className="text-xs text-gray-400">(comma separated)</span></label>
              <textarea placeholder="Facilities" value={formData.facilities} onChange={(e) => setFormData({ ...formData, facilities: e.target.value })} className="border border-gray-300 rounded-lg p-3 h-24 focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
            </div>

            <div className="w-full flex justify-end items-center gap-4">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="mt-4 w-[100px] bg-orange-600 text-white font-semibold py-3 rounded-lg hover:bg-orange-700 transition duration-300 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="mt-4 w-[200px] bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition duration-300 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                disabled={loading}
              >
                {editingHostel ? "Update Hostel" : "Add Hostel"}
              </button>
            </div>
          </form>
        </Modal>

        {/* Hostel Table */}
        <div className="overflow-x-auto rounded-lg shadow-md border border-gray-300">
          <table className="w-full border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-4 text-left text-sm font-semibold text-gray-600">Hostel Name</th>
                <th className="p-4 text-left text-sm font-semibold text-gray-600">Block</th>
                <th className="p-4 text-left text-sm font-semibold text-gray-600">Floor</th>
                <th className="p-4 text-left text-sm font-semibold text-gray-600">Gender Restriction</th>
                <th className="p-4 text-left text-sm font-semibold text-gray-600">Location</th>
                <th className="p-4 text-left text-sm font-semibold text-gray-600">Description</th>
                <th className="p-4 text-left text-sm font-semibold text-gray-600">Facilities</th>
                <th className="p-4 text-left text-sm font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {hostels.map((h) => (
                <tr key={h._id} className="bg-white hover:bg-gray-50 border-t border-gray-200">
                  <td className="p-4">{h.name}</td>
                  <td className="p-4">{h.block}</td>
                  <td className="p-4">{h.floor}</td>
                  <td className="p-4">{h.genderRestriction }</td>
                  <td className="p-4">{h.location}</td>
                  <td className="p-4">{h.description}</td>
                  <td className="p-4">{Array.isArray(h.facilities) ? h.facilities.join(", ") : h.facilities}</td>
                  <td className="p-4 flex gap-2">
                    <button
                      onClick={() => openEditHostelModal(h)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteClick(h._id)}
                      className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700 transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {hostels.length === 0 && !loading && (
                <tr>
                  <td colSpan="8" className="text-center p-4 text-gray-500 italic">
                    No hostels found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        message="Are you sure you want to delete this hostel?"
        onConfirm={confirmDelete}
        onCancel={() => setIsConfirmModalOpen(false)}
      />
    </div>
  );
}
