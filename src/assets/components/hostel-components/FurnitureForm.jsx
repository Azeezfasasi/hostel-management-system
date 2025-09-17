import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "@/config/api";

const FurnitureForm = () => {
  const [categories, setCategories] = useState([]);
  const [facilityCategories, setFacilityCategories] = useState([]);
  const [furniture, setFurniture] = useState([]);
  const [facilities, setFacilities] = useState([]);

  const [formData, setFormData] = useState({
    type: "Furniture", // Furniture or Facility
    category: "",
    name: "",
    quantity: "",
    condition: "Good",
    location: "",
  });

  // Fetch furniture categories
  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/furniture/furniture-categories`);
      setCategories(res.data);
    } catch (error) {
      console.error("Error fetching categories:", error.message);
    }
  };

  // Fetch facility categories
  const fetchFacilityCategories = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/facility/facility-categories`);
      setFacilityCategories(res.data);
    } catch (error) {
      console.error("Error fetching facility categories:", error.message);
    }
  };

  // Fetch furniture
  const fetchFurniture = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/furniture/furniture`);
      setFurniture(res.data);
    } catch (error) {
      console.error("Error fetching furniture:", error.message);
    }
  };

  // Fetch facilities
  const fetchFacilities = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/facility/facility`);
      setFacilities(res.data);
    } catch (error) {
      console.error("Error fetching facilities:", error.message);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchFacilityCategories();
    fetchFurniture();
    fetchFacilities();
  }, []);

  // Handle Add
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.type === "Furniture") {
        await axios.post(`${API_BASE_URL}/furniture/furniture`, formData);
        fetchFurniture();
        alert("Furniture added ✅");
      } else if (formData.type === "Facility") {
        // Only send relevant fields for facility
        const facilityData = {
          name: formData.name,
          location: formData.location,
          category: formData.category,
        };
        await axios.post(`${API_BASE_URL}/facility/facility`, facilityData);
        fetchFacilities();
        alert("Facility added ✅");
      }
      setFormData({
        type: "Furniture",
        category: "",
        name: "",
        quantity: "",
        condition: "Good",
        location: "",
      });
    } catch (error) {
      console.error("Error adding item:", error.message);
    }
  };

  return (
    <div className="p-6 bg-white shadow rounded-lg">
      <h2 className="text-xl font-bold mb-4">➕ Add Furniture/Facilities</h2>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6"
      >
        {/* Type selector */}
        <select
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          className="border rounded p-2"
          required
        >
          <option value="Furniture">Furniture</option>
          <option value="Facility">Facility</option>
        </select>

        {/* Category (for furniture or facility) */}
        {formData.type === "Furniture" && (
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="border rounded p-2"
            required
          >
            <option value="">Select Category</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
        )}
        {formData.type === "Facility" && (
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="border rounded p-2"
            required
          >
            <option value="">Select Category</option>
            {facilityCategories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
        )}

        {/* Name */}
        <input
          type="text"
          placeholder={formData.type === "Furniture" ? "Furniture name" : "Facility name"}
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="border rounded p-2"
          required
        />

        {/* Quantity (only for furniture) */}
        {formData.type === "Furniture" && (
          <input
            type="number"
            placeholder="Quantity"
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
            className="border rounded p-2"
            required
          />
        )}

        {/* Condition (only for furniture) */}
        {formData.type === "Furniture" && (
          <select
            value={formData.condition}
            onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
            className="border rounded p-2"
          >
            <option value="Good">Good</option>
            <option value="Needs Repair">Needs Repair</option>
            <option value="Damaged">Damaged</option>
          </select>
        )}

        {/* Location */}
        <input
          type="text"
          placeholder="Location (e.g., Block A - Room 1)"
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          className="border rounded p-2 md:col-span-2"
        />

        <button
          type="submit"
          className="col-span-1 md:col-span-2 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          {formData.type === "Furniture" ? "Add Furniture" : "Add Facility"}
        </button>
      </form>

      {/* List */}
      {/* <h3 className="text-lg font-semibold mb-2">Furniture List</h3>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300 shadow">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">Category</th>
              <th className="border p-2">Name</th>
              <th className="border p-2">Quantity</th>
              <th className="border p-2">Condition</th>
              <th className="border p-2">Location</th>
            </tr>
          </thead>
          <tbody>
            {furniture.map((f) => (
              <tr key={f._id} className="hover:bg-gray-50">
                <td className="border p-2">{f.category?.name}</td>
                <td className="border p-2">{f.name}</td>
                <td className="border p-2">{f.quantity}</td>
                <td className="border p-2">{f.condition}</td>
                <td className="border p-2">{f.location}</td>
              </tr>
            ))}
            {furniture.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center p-4 text-gray-500">
                  No furniture added yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div> */}
    </div>
  );
};

export default FurnitureForm;
