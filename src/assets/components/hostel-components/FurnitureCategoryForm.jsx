import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "@/config/api";

const FurnitureCategoryForm = () => {
  const [type, setType] = useState("Furniture"); // Furniture or Facility
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");

  // Fetch categories
  const fetchCategories = async () => {
    try {
      let endpoint = type === "Furniture"
        ? `${API_BASE_URL}/furniture/furniture-categories`
        : `${API_BASE_URL}/facility/facility-categories`;
      const res = await axios.get(endpoint);
      setCategories(res.data);
    } catch (error) {
      console.error("Error fetching categories:", error.message);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [type]);

  // Handle Add
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name) return;
    try {
      let endpoint = type === "Furniture"
        ? `${API_BASE_URL}/furniture/furniture-categories`
        : `${API_BASE_URL}/facility/facility-categories`;
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
          placeholder="Enter category name"
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
      <ul className="list-disc pl-6">
        {categories.map((c) => (
          <CategoryItem key={c._id} category={c} fetchCategories={fetchCategories} />
        ))}
        {categories.length === 0 && (
          <p className="text-gray-500">No categories yet</p>
        )}
      </ul>
    </div>
  );
}

function CategoryItem({ category, fetchCategories }) {
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState(category.name);
  const [loading, setLoading] = useState(false);

  // Determine type from fetchCategories closure
  const isFacility = fetchCategories.toString().includes('/facility/facility-categories');
  const endpointBase = isFacility
    ? `${API_BASE_URL}/facility/facility-categories`
    : `${API_BASE_URL}/furniture/furniture-categories`;

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
    <li className="py-1 flex items-center gap-2 group">
      {editing ? (
        <>
          <input
            type="text"
            value={editName}
            onChange={e => setEditName(e.target.value)}
            className="border rounded px-2 py-1 text-sm mr-2"
            disabled={loading}
            autoFocus
          />
          <button
            className="text-green-600 hover:underline text-xs font-semibold mr-1"
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
          <span className="font-medium text-gray-800">{category.name}</span>
          <button
            className="ml-2 text-blue-600 hover:underline text-xs font-semibold opacity-0 group-hover:opacity-100 transition"
            onClick={() => setEditing(true)}
            disabled={loading}
          >Edit</button>
          <button
            className="ml-1 text-red-500 hover:underline text-xs font-semibold opacity-0 group-hover:opacity-100 transition"
            onClick={handleDelete}
            disabled={loading}
          >Delete</button>
        </>
      )}
    </li>
  );
}

export default FurnitureCategoryForm;
