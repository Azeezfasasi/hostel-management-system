import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = "http://localhost:5000/api"; // backend URL

const FurnitureCategoryForm = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API_BASE}/furniture-categories`);
      setCategories(res.data);
    } catch (error) {
      console.error("Error fetching categories:", error.message);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Handle Add
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name) return;
    try {
      await axios.post(`${API_BASE}/furniture-categories`, { name });
      setName("");
      fetchCategories();
      alert("Category added ✅");
    } catch (error) {
      console.error("Error adding category:", error.message);
    }
  };

  return (
    <div className="p-6 bg-white shadow rounded-lg mb-8">
      <h2 className="text-xl font-bold mb-4">➕ Add Furniture Category</h2>

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

      <h3 className="text-lg font-semibold mb-2">Categories</h3>
      <ul className="list-disc pl-6">
        {categories.map((c) => (
          <li key={c._id} className="py-1">{c.name}</li>
        ))}
        {categories.length === 0 && (
          <p className="text-gray-500">No categories yet</p>
        )}
      </ul>
    </div>
  );
};

export default FurnitureCategoryForm;
