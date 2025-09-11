import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = "http://localhost:5000/api"; // backend URL

const FurnitureList = () => {
  const [furniture, setFurniture] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch furniture
  const fetchFurniture = async () => {
    try {
      const res = await axios.get(`${API_BASE}/furniture`);
      setFurniture(res.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching furniture:", error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFurniture();
  }, []);

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
      <h2 className="text-2xl font-bold mb-6">📦 All Furniture Details</h2>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300 shadow-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-3 text-left">Category</th>
              <th className="border p-3 text-left">Name</th>
              <th className="border p-3 text-center">Quantity</th>
              <th className="border p-3 text-center">Condition</th>
              <th className="border p-3 text-left">Location</th>
            </tr>
          </thead>
          <tbody>
            {furniture.map((f) => (
              <tr key={f._id} className="hover:bg-gray-50 transition">
                <td className="border p-3">{f.category?.name || "N/A"}</td>
                <td className="border p-3">{f.name}</td>
                <td className="border p-3 text-center">{f.quantity}</td>
                <td className="border p-3 text-center">
                  <span
                    className={`px-3 py-1 rounded text-sm font-medium ${getConditionBadge(
                      f.condition
                    )}`}
                  >
                    {f.condition}
                  </span>
                </td>
                <td className="border p-3">{f.location || "Not specified"}</td>
              </tr>
            ))}
            {furniture.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center p-6 text-gray-500">
                  No furniture records available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FurnitureList;
