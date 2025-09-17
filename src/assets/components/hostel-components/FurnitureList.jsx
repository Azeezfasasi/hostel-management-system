import React, { useEffect, useState } from "react";
// ...existing code...
import axios from "axios";
import { API_BASE_URL } from "@/config/api";

const FurnitureList = () => {
  const [type, setType] = useState("Furniture"); // Furniture or Facility
  const [furniture, setFurniture] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [categories, setCategories] = useState([]);
  const [facilityCategories, setFacilityCategories] = useState([]);
  const [filterCategory, setFilterCategory] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);

  // Fetch categories for filter
  useEffect(() => {
    axios.get(`${API_BASE_URL}/furniture/furniture-categories`).then(res => setCategories(res.data));
    axios.get(`${API_BASE_URL}/facility/facility-categories`).then(res => setFacilityCategories(res.data));
  }, []);

  // Fetch furniture or facilities with filters, search, pagination
  const fetchItems = async () => {
    setLoading(true);
    try {
      const params = {
        category: filterCategory,
        status: filterStatus,
        search,
        page,
        limit
      };
      if (type === "Furniture") {
        const res = await axios.get(`${API_BASE_URL}/furniture/furniture`, { params });
        setFurniture(res.data.items || res.data);
        setTotal(res.data.total || res.data.length || 0);
      } else {
        const res = await axios.get(`${API_BASE_URL}/facility/facility`, { params });
        setFacilities(res.data.items || res.data);
        setTotal(res.data.total || res.data.length || 0);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching items:", error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
    // eslint-disable-next-line
  }, [type, filterCategory, filterStatus, search, page, limit]);

  // Badge styling for condition
  const getConditionBadge = (condition) => {
    switch (condition) {
      case "Good":
        return "bg-green-100 text-green-800";
      case "Needs Repair":
        return "bg-yellow-100 text-yellow-800";
      case "Damaged":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return <p className="p-6 text-gray-600">Loading furniture details...</p>;
  }

  return (
    <div className="p-6 bg-white shadow rounded-lg">
      <h2 className="text-2xl font-bold mb-6">📦 All {type} Details</h2>

      {/* Type Filter */}
      <div className="flex flex-wrap gap-4 mb-4 items-center">
        <select
          className="border rounded p-2"
          value={type}
          onChange={e => { setType(e.target.value); setPage(1); setFilterCategory(""); setFilterStatus(""); setSearch(""); }}
        >
          <option value="Furniture">Furniture</option>
          <option value="Facility">Facility</option>
        </select>
        <select
          className="border rounded p-2"
          value={filterCategory}
          onChange={e => { setFilterCategory(e.target.value); setPage(1); }}
        >
          <option value="">All Categories</option>
          {(type === "Furniture" ? categories : facilityCategories).map(cat => (
            <option key={cat._id} value={cat._id}>{cat.name}</option>
          ))}
        </select>
        <select
          className="border rounded p-2"
          value={filterStatus}
          onChange={e => { setFilterStatus(e.target.value); setPage(1); }}
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="in-use">In Use</option>
          <option value="damage">Damaged</option>
          <option value="under-repair">Under Repair</option>
        </select>
        <input
          type="text"
          className="border rounded p-2"
          placeholder={`Search by name...`}
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300 shadow-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-3 text-left">Category</th>
              <th className="border p-3 text-left">Name</th>
              {type === "Furniture" && <th className="border p-3 text-center">Quantity</th>}
              {type === "Furniture" && <th className="border p-3 text-center">Condition</th>}
              <th className="border p-3 text-left">Location</th>
              <th className="border p-3 text-left">Status</th>
              <th className="border p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(type === "Furniture" ? furniture : facilities).map((item) => (
              <tr key={item._id} className="hover:bg-gray-50 transition">
                <td className="border p-3">{item.category?.name || "N/A"}</td>
                <td className="border p-3">{item.name}</td>
                {type === "Furniture" && <td className="border p-3 text-center">{item.quantity}</td>}
                {type === "Furniture" && <td className="border p-3 text-center">
                  <span
                    className={`px-3 py-1 rounded text-sm font-medium ${getConditionBadge(item.condition)}`}
                  >
                    {item.condition}
                  </span>
                </td>}
                <td className="border p-3">{item.location || "Not specified"}</td>
                <td className="border p-3">
                  <span
                    className={`px-3 py-1 rounded text-sm font-medium ${item.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                  >
                    {item.status}
                  </span>
                </td>
                {/* Admin Actions */}
                <td className="border p-3 flex gap-2">
                  {/* Edit */}
                  <button
                    className="text-blue-600 hover:underline text-xs"
                    onClick={() => {
                      setEditData(item);
                      setEditModalOpen(true);
                    }}
                  >Edit</button>
                  {/* Delete */}
                  <button
                    className="text-red-600 hover:underline text-xs"
                    onClick={() => {
                      if (window.confirm(`Delete this ${type.toLowerCase()}?`)) {
                        axios.delete(`${API_BASE_URL}/${type === "Furniture" ? "furniture/furniture" : "facility/facility"}/${item._id}`)
                          .then(() => fetchItems());
                      }
                    }}
                  >Delete</button>
                  {/* Change Status */}
                  <select
                    className="text-xs border rounded px-1"
                    value={item.status || 'active'}
                    onChange={e => {
                      axios.patch(`${API_BASE_URL}/${type === "Furniture" ? "furniture/furniture" : "facility/facility"}/${item._id}/status`, { status: e.target.value })
                        .then(() => fetchItems());
                    }}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="in-use">In Use</option>
                    <option value="damage">Damaged</option>
                    <option value="under-repair">Under Repair</option>
                  </select>
                </td>
              </tr>
            ))}
            {(type === "Furniture" ? furniture : facilities).length === 0 && (
              <tr>
                <td colSpan={type === "Furniture" ? 7 : 5} className="text-center p-6 text-gray-500">
                  No {type.toLowerCase()} records available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4">
        <div className="flex gap-2 items-center">
          <button
            className="px-3 py-1 rounded border bg-gray-100"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >Prev</button>
          <span>Page {page} of {Math.max(1, Math.ceil(total / limit))}</span>
          <button
            className="px-3 py-1 rounded border bg-gray-100"
            disabled={page >= Math.ceil(total / limit)}
            onClick={() => setPage(page + 1)}
          >Next</button>
        </div>
        <div>
          <label className="mr-2">Rows:</label>
          <select value={limit} onChange={e => { setLimit(Number(e.target.value)); setPage(1); }} className="border rounded p-1">
            {[5, 10, 20, 50].map(n => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Edit Modal */}
      {editModalOpen && editData && (
        type === "Furniture" ? (
          <EditFurnitureModal
            furniture={editData}
            onClose={() => setEditModalOpen(false)}
            onSave={async (updated) => {
              await axios.put(`${API_BASE_URL}/furniture/furniture/${editData._id}`, updated);
              setEditModalOpen(false);
              setEditData(null);
              fetchItems();
            }}
          />
        ) : (
          <EditFacilityModal
            facility={editData}
            categories={facilityCategories}
            onClose={() => setEditModalOpen(false)}
            onSave={async (updated) => {
              await axios.put(`${API_BASE_URL}/facility/facility/${editData._id}`, updated);
              setEditModalOpen(false);
              setEditData(null);
              fetchItems();
            }}
          />
        )
      )}
    </div>
  );

// Modal component for furniture
function EditFurnitureModal({ furniture, onClose, onSave }) {
  const [form, setForm] = useState({
    name: furniture.name,
    quantity: furniture.quantity,
    condition: furniture.condition,
    location: furniture.location,
    status: furniture.status,
    category: furniture.category?._id || ""
  });
  const [categories, setCategories] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/furniture/furniture-categories`).then(res => setCategories(res.data));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    await onSave(form);
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
          onClick={onClose}
          disabled={saving}
        >&times;</button>
        <h3 className="text-lg font-bold mb-4">Edit Furniture Details</h3>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="border rounded p-2"
            required
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
          </select>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="border rounded p-2"
            placeholder="Name"
            required
          />
          <input
            type="number"
            name="quantity"
            value={form.quantity}
            onChange={handleChange}
            className="border rounded p-2"
            placeholder="Quantity"
            required
          />
          <select
            name="condition"
            value={form.condition}
            onChange={handleChange}
            className="border rounded p-2"
          >
            <option value="Good">Good</option>
            <option value="Needs Repair">Needs Repair</option>
            <option value="Damaged">Damaged</option>
          </select>
          <input
            type="text"
            name="location"
            value={form.location}
            onChange={handleChange}
            className="border rounded p-2"
            placeholder="Location"
          />
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="border rounded p-2"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="in-use">In Use</option>
            <option value="damage">Damaged</option>
            <option value="under-repair">Under Repair</option>
          </select>
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            disabled={saving}
          >{saving ? 'Saving...' : 'Save Changes'}</button>
        </form>
      </div>
    </div>
  );
}

// Modal component for facility
function EditFacilityModal({ facility, categories, onClose, onSave }) {
  const [form, setForm] = useState({
    name: facility.name,
    location: facility.location,
    status: facility.status,
    category: facility.category?._id || ""
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    await onSave(form);
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
          onClick={onClose}
          disabled={saving}
        >&times;</button>
        <h3 className="text-lg font-bold mb-4">Edit Facility Details</h3>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="border rounded p-2"
            required
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
          </select>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="border rounded p-2"
            placeholder="Name"
            required
          />
          <input
            type="text"
            name="location"
            value={form.location}
            onChange={handleChange}
            className="border rounded p-2"
            placeholder="Location"
          />
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="border rounded p-2"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="in-use">In Use</option>
            <option value="damage">Damaged</option>
            <option value="under-repair">Under Repair</option>
          </select>
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            disabled={saving}
          >{saving ? 'Saving...' : 'Save Changes'}</button>
        </form>
      </div>
    </div>
  );
}
};

export default FurnitureList;
