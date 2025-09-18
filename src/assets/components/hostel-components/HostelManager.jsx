import React, { useState, useEffect } from "react";
import close from '../../images/close.svg';
import { API_BASE_URL } from "@/config/api";
import { PencilLine, Trash2, Eye } from 'lucide-react';
import { useUser } from "@/assets/context-api/user-context/UseUser";

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
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [hostels, setHostels] = useState([]);
  const [filterCampus, setFilterCampus] = useState("");
  const [filterHostel, setFilterHostel] = useState("");
  const [search, setSearch] = useState("");
  const [formData, setFormData] = useState({ hostelCampus: "", name: "", block: "", floor: "", location: "", description: "", genderRestriction: "", rulesAndPolicies: "", facilities: "" });
  const [editingHostel, setEditingHostel] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [hostelToDelete, setHostelToDelete] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  // View details modal state
  const [viewHostel, setViewHostel] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const { isSuperAdmin } = useUser();

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
        setFormData({ hostelCampus: "", name: "", block: "", floor: "", location: "", description: "", genderRestriction: "", rulesAndPolicies: "", facilities: "" });
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
    setFormData({ hostelCampus: "", name: "", block: "", floor: "", location: "", description: "", genderRestriction: "", rulesAndPolicies: "", facilities: "" });
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
    <div className="min-h-screen bg-gray-100 p-4 md:p-6 font-sans">
      <div className="md:p-6 max-w-6xl mx-auto bg-white rounded-xl shadow-lg border border-gray-200">
        <div className="flex flex-col md:flex-row gap-6 md:gap-0 justify-between items-center mb-6">
          <h2 className="text-[22px] md:text-[30px] font-bold text-gray-800">🏨 Hostel Management</h2>
          {isSuperAdmin && (
            <button
              onClick={openAddHostelModal}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Add Hostel
            </button>
          )}
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <select
            value={filterCampus}
            onChange={e => setFilterCampus(e.target.value)}
            className="border rounded p-2 min-w-[180px]"
          >
            <option value="">All Campuses</option>
            {[...new Set(hostels.map(h => h.hostelCampus))].map((campus, i) => (
              <option key={i} value={campus}>{campus}</option>
            ))}
          </select>
          <select
            value={filterHostel}
            onChange={e => setFilterHostel(e.target.value)}
            className="border rounded p-2 min-w-[180px]"
          >
            <option value="">All Hostels</option>
            {[...new Set(hostels.map(h => h.name))].map((name, i) => (
              <option key={i} value={name}>{name}</option>
            ))}
          </select>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="border rounded p-2 min-w-[220px]"
            placeholder="Search by location, description, block, floor..."
          />
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
              <label className="text-sm font-medium text-gray-700 mb-1">Campus Name</label>
              <input
                type="text"
                placeholder="Campus Name"
                value={formData.hostelCampus ?? ""}
                onChange={(e) => setFormData({ ...formData, hostelCampus: e.target.value })}
                className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">Hostel Name</label>
              <input
                type="text"
                placeholder="Hostel Name"
                value={formData.name ?? ""}
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
                  value={formData.block ?? ""}
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
                  value={formData.floor ?? ""}
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
                value={formData.genderRestriction ?? ""}
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
                value={formData.location ?? ""}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea placeholder="Description" value={formData.description ?? ""} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="border border-gray-300 rounded-lg p-3 h-24 focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">Rules and Policies</label>
              <textarea placeholder="Rules and Policies" value={formData.rulesAndPolicies ?? ""} onChange={(e) => setFormData({ ...formData, rulesAndPolicies: e.target.value })} className="border border-gray-300 rounded-lg p-3 h-24 focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">Facilities <span className="text-xs text-gray-400">(comma separated)</span></label>
              <textarea placeholder="Facilities" value={formData.facilities ?? ""} onChange={(e) => setFormData({ ...formData, facilities: e.target.value })} className="border border-gray-300 rounded-lg p-3 h-24 focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
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
                className={`mt-4 w-[200px] bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition duration-300 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer flex items-center justify-center ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  editingHostel ? "Update Hostel" : "Add Hostel"
                )}
              </button>
            </div>
          </form>
        </Modal>

        {/* Hostel Table */}
        <div className="overflow-x-auto rounded-lg shadow-md border border-gray-300">
          <table className="w-full border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-4 text-left text-sm font-semibold text-gray-600">Campus Name</th>
                <th className="p-4 text-left text-sm font-semibold text-gray-600">Hostel Name</th>
                <th className="p-4 text-left text-sm font-semibold text-gray-600">Block</th>
                <th className="p-4 text-left text-sm font-semibold text-gray-600">Floor</th>
                <th className="p-4 text-left text-sm font-semibold text-gray-600">Gender Restriction</th>
                <th className="p-4 text-left text-sm font-semibold text-gray-600">Location</th>
                <th className="p-4 text-left text-sm font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {(() => {
                const filtered = hostels
                  .filter(h =>
                    (!filterCampus || h.hostelCampus === filterCampus) &&
                    (!filterHostel || h.name === filterHostel) &&
                    (
                      !search ||
                      h.name.toLowerCase().includes(search.toLowerCase()) ||
                      h.hostelCampus.toLowerCase().includes(search.toLowerCase()) ||
                      h.location.toLowerCase().includes(search.toLowerCase()) ||
                      h.description.toLowerCase().includes(search.toLowerCase()) ||
                      h.block.toLowerCase().includes(search.toLowerCase()) ||
                      h.floor.toString().toLowerCase().includes(search.toLowerCase())
                    )
                  );
                const paginated = filtered.slice((page - 1) * limit, page * limit);
                return paginated.map((h) => (
                  <tr key={h._id} className="bg-white hover:bg-gray-50 border-t border-gray-200">
                    <td className="p-4">{h.hostelCampus}</td>
                    <td className="p-4">{h.name}</td>
                    <td className="p-4">{h.block}</td>
                    <td className="p-4">{h.floor}</td>
                    <td className="p-4">{h.genderRestriction }</td>
                    <td className="p-4">{h.location}</td>
                    <td className="p-4 flex gap-2">
                      <button
                        onClick={() => { setViewHostel(h); setIsViewModalOpen(true); }}
                        className="bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 transition cursor-pointer"
                      >
                        <Eye className="w-4 4- 4md:w-6 md:h-6" />
                      </button>
                      {isSuperAdmin && (
                      <>
                        <button
                          onClick={() => openEditHostelModal(h)}
                          className="bg-yellow-500 text-white px-3 py-2 rounded-lg hover:bg-yellow-600 transition cursor-pointer"
                        >
                          <PencilLine className="w-4 4- 4md:w-6 md:h-6" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(h._id)}
                          className="bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition cursor-pointer"
                        >
                          <Trash2 className="w-4 4- 4md:w-6 md:h-6"/>
                        </button>
                      </>
                      )}
                    </td>
                  </tr>
                ))
              })()}
              {hostels.length === 0 && !loading && (
                <tr>
                  <td colSpan="8" className="text-center p-4 text-gray-500 italic">
                    No hostels found.
                  </td>
                </tr>
              )}
        {/* Pagination Controls */}
        <div className="flex justify-between items-center mt-6">
          <div>
            <button
              className="px-4 py-2 mr-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
            >
              Previous
            </button>
            <button
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
              onClick={() => setPage(page + 1)}
              disabled={((hostels.filter(h =>
                (!filterCampus || h.hostelCampus === filterCampus) &&
                (!filterHostel || h.name === filterHostel) &&
                (
                  !search ||
                  h.name.toLowerCase().includes(search.toLowerCase()) ||
                  h.hostelCampus.toLowerCase().includes(search.toLowerCase()) ||
                  h.location.toLowerCase().includes(search.toLowerCase()) ||
                  h.description.toLowerCase().includes(search.toLowerCase()) ||
                  h.block.toLowerCase().includes(search.toLowerCase()) ||
                  h.floor.toString().toLowerCase().includes(search.toLowerCase())
                )
              )).length <= page * limit)}
            >
              Next
            </button>
          </div>
          <div>
            Page {page} of {Math.max(1, Math.ceil(hostels.filter(h =>
              (!filterCampus || h.hostelCampus === filterCampus) &&
              (!filterHostel || h.name === filterHostel) &&
              (
                !search ||
                h.name.toLowerCase().includes(search.toLowerCase()) ||
                h.hostelCampus.toLowerCase().includes(search.toLowerCase()) ||
                h.location.toLowerCase().includes(search.toLowerCase()) ||
                h.description.toLowerCase().includes(search.toLowerCase()) ||
                h.block.toLowerCase().includes(search.toLowerCase()) ||
                h.floor.toString().toLowerCase().includes(search.toLowerCase())
              )
            ).length / limit))}
            <select
              className="ml-4 border rounded p-1"
              value={limit}
              onChange={e => { setLimit(Number(e.target.value)); setPage(1); }}
            >
              {[10, 20, 50, 100].map(n => (
                <option key={n} value={n}>{n} per page</option>
              ))}
            </select>
          </div>
        </div>
            </tbody>
          </table>
        </div>
      </div>
      {/* View Details Modal */}
      <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)}>
        {viewHostel && (
          <div>
            <h3 className="text-2xl font-bold mb-4 text-gray-800">Hostel Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><span className="font-semibold">Campus Name:</span> {viewHostel.hostelCampus}</div>
              <div><span className="font-semibold">Hostel Name:</span> {viewHostel.name}</div>
              <div><span className="font-semibold">Block:</span> {viewHostel.block}</div>
              <div><span className="font-semibold">Floor:</span> {viewHostel.floor}</div>
              <div><span className="font-semibold">Gender Restriction:</span> {viewHostel.genderRestriction}</div>
              <div><span className="font-semibold">Location:</span> {viewHostel.location}</div>
              <div className="md:col-span-2"><span className="font-semibold">Description:</span> {viewHostel.description}</div>
              <div className="md:col-span-2"><span className="font-semibold">Rules & Policies:</span> {viewHostel.rulesAndPolicies}</div>
              <div className="md:col-span-2"><span className="font-semibold">Facilities:</span> {Array.isArray(viewHostel.facilities) ? viewHostel.facilities.join(", ") : viewHostel.facilities}</div>
            </div>
          </div>
        )}
      </Modal>
      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        message="Are you sure you want to delete this hostel?"
        onConfirm={confirmDelete}
        onCancel={() => setIsConfirmModalOpen(false)}
      />
    </div>
  );
}
