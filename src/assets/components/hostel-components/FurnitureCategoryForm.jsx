import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "@/config/api";

// Helper to get endpoints
const getCategoryEndpoint = (type) =>
  type === "Furniture"
    ? `${API_BASE_URL}/furniture/furniture-categories`
    : `${API_BASE_URL}/facility/facility-categories`;

const FurnitureCategoryForm = () => {
  const [type, setType] = useState("Furniture"); // Furniture or Facility
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const endpoint = getCategoryEndpoint(type);
      const res = await axios.get(endpoint);
      setCategories(res.data);
    } catch (error) {
      console.error("Error fetching categories:", error.message);
    }
  };

  useEffect(() => {
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  // Handle Add
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name) return;
    try {
      const endpoint = getCategoryEndpoint(type);
      await axios.post(endpoint, { name });
      setName("");
      fetchCategories();
      alert("Category added ✅");
    } catch (error) {
      console.error("Error adding category:", error.message);
    }
  };

  return (
    <div className="p-6 bg-white shadow rounded-lg mb-8">
      <h2 className="text-xl font-bold mb-4">➕ Add Category</h2>

      {/* Type selector */}
      <div className="mb-4">
        <select
          value={type}
          onChange={e => setType(e.target.value)}
          className="border rounded p-2"
        >
          <option value="Furniture">Furniture</option>
          <option value="Facility">Facility</option>
        </select>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder={`Enter ${type} category name`}
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border rounded p-2 flex-1"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Add
        </button>
      </form>

      <h3 className="text-lg font-semibold mb-2">{type} Categories</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 rounded">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 border-b text-left">Name</th>
              <th className="py-2 px-4 border-b text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c) => (
              <CategoryRow key={c._id} category={c} fetchCategories={fetchCategories} type={type} />
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan={2} className="py-2 px-4 text-gray-500 text-center">No categories yet</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CategoryRow({ category, fetchCategories, type }) {
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState(category.name);
  const [loading, setLoading] = useState(false);

  const endpointBase = getCategoryEndpoint(type);

  const handleEdit = async () => {
    if (!editName.trim() || editName === category.name) {
      setEditing(false);
      return;
    }
    setLoading(true);
    try {
      await axios.put(`${endpointBase}/${category._id}`, { name: editName });
      fetchCategories();
      setEditing(false);
    } catch {
      alert('Error editing category');
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    if (window.confirm(`Delete category '${category.name}'?`)) {
      setLoading(true);
      try {
        await axios.delete(`${endpointBase}/${category._id}`);
        fetchCategories();
      } catch {
        alert('Error deleting category');
      }
      setLoading(false);
    }
  };

  return (
    <tr>
      <td className="py-2 px-4 border-b">
        {editing ? (
          <input
            type="text"
            value={editName}
            onChange={e => setEditName(e.target.value)}
            className="border rounded px-2 py-1 text-sm w-full"
            disabled={loading}
            autoFocus
          />
        ) : (
          <span className="font-medium text-gray-800">{category.name}</span>
        )}
      </td>
      <td className="py-2 px-4 border-b">
        {editing ? (
          <>
            <button
              className="text-green-600 hover:underline text-xs font-semibold mr-2"
              onClick={handleEdit}
              disabled={loading}
            >Save</button>
            <button
              className="text-gray-500 hover:underline text-xs"
              onClick={() => setEditing(false)}
              disabled={loading}
            >Cancel</button>
          </>
        ) : (
          <>
            <button
              className="text-blue-600 hover:underline text-xs font-semibold mr-2"
              onClick={() => setEditing(true)}
              disabled={loading}
            >Edit</button>
            <button
              className="text-red-500 hover:underline text-xs font-semibold"
              onClick={handleDelete}
              disabled={loading}
            >Delete</button>
          </>
        )}
      </td>
    </tr>
  );
}

export default FurnitureCategoryForm;
