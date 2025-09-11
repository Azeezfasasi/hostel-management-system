import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = "http://localhost:5000/api"; // backend URL

const DamageReportFormMain = ({ studentId }) => {
  const [categories] = useState(["Furniture", "Facility"]);
  const [furniture, setFurniture] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    category: "",
    itemId: "",
    description: "",
  });

  // ✅ Fetch data
  const fetchFurniture = async () => {
    try {
      const res = await axios.get(`${API_BASE}/furniture`);
      setFurniture(res.data);
    } catch (error) {
      console.error("Error fetching furniture:", error.message);
    }
  };

  const fetchRooms = async () => {
    try {
      const res = await axios.get(`${API_BASE}/rooms`);
      setRooms(res.data);
    } catch (error) {
      console.error("Error fetching rooms:", error.message);
    }
  };

  const fetchReports = async () => {
    try {
      const res = await axios.get(`${API_BASE}/reports/student/${studentId}`);
      setReports(res.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching reports:", error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFurniture();
    fetchRooms();
    fetchReports();
  }, []);

  // ✅ Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE}/reports`, {
        ...formData,
        student: studentId,
      });
      alert("Damage reported successfully ✅");
      setFormData({ category: "", itemId: "", description: "" });
      fetchReports();
    } catch (error) {
      console.error("Error reporting damage:", error.message);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">📝 Report Damage</h2>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-6 rounded-lg shadow mb-10"
      >
        {/* Category */}
        <select
          value={formData.category}
          onChange={(e) =>
            setFormData({ ...formData, category: e.target.value, itemId: "" })
          }
          className="border rounded p-2"
          required
        >
          <option value="">Select Category</option>
          {categories.map((c, i) => (
            <option key={i} value={c}>
              {c}
            </option>
          ))}
        </select>

        {/* Item */}
        {formData.category === "Furniture" && (
          <select
            value={formData.itemId}
            onChange={(e) => setFormData({ ...formData, itemId: e.target.value })}
            className="border rounded p-2"
            required
          >
            <option value="">Select Furniture</option>
            {furniture.map((f) => (
              <option key={f._id} value={f._id}>
                {f.name} ({f.location})
              </option>
            ))}
          </select>
        )}

        {formData.category === "Facility" && (
          <select
            value={formData.itemId}
            onChange={(e) => setFormData({ ...formData, itemId: e.target.value })}
            className="border rounded p-2"
            required
          >
            <option value="">Select Room</option>
            {rooms.map((r) => (
              <option key={r._id} value={r._id}>
                {r.name} - {r.hostel?.name}
              </option>
            ))}
          </select>
        )}

        {/* Description */}
        <textarea
          placeholder="Describe the damage..."
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="border rounded p-2 md:col-span-2"
          rows={3}
          required
        />

        <button
          type="submit"
          className="col-span-1 md:col-span-2 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Submit Report
        </button>
      </form>

      {/* Reports */}
      <h3 className="text-xl font-semibold mb-4">📋 My Reports</h3>
      {loading ? (
        <p className="text-gray-600">Loading reports...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 shadow">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-3">Category</th>
                <th className="border p-3">Item</th>
                <th className="border p-3">Description</th>
                <th className="border p-3">Status</th>
                <th className="border p-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((r) => (
                <tr key={r._id} className="hover:bg-gray-50">
                  <td className="border p-3">{r.category}</td>
                  <td className="border p-3">
                    {r.category === "Furniture"
                      ? r.furniture?.name
                      : r.room?.name}
                  </td>
                  <td className="border p-3">{r.description}</td>
                  <td className="border p-3">
                    <span
                      className={`px-3 py-1 rounded text-sm font-medium ${
                        r.status === "Pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : r.status === "In Progress"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td className="border p-3">
                    {new Date(r.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {reports.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center p-4 text-gray-500">
                    No reports submitted yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DamageReportFormMain;
