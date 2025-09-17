import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "@/config/api";

const DamageReportFormMain = ({ studentId }) => {
  const [categories] = useState(["Furniture", "Facility"]);
  const [furniture, setFurniture] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [facilityCategories, setFacilityCategories] = useState([]);
  const [myDamageReports, setMyDamageReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    category: "",
    itemId: "",
    description: "",
    facilityCategory: ""
  });

  // ✅ Fetch data
  const fetchFurniture = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/furniture/furniture`);
      setFurniture(res.data.items || res.data);
    } catch (error) {
      console.error("Error fetching furniture:", error.message);
    }
  };

  // Fetch facilities
  const fetchFacilities = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/facility/facility`);
      setFacilities(res.data || []);
    } catch (error) {
      console.error("Error fetching facilities:", error.message);
    }
  };

  // Fetch facility categories
  const fetchFacilityCategories = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/facility/facility-categories`);
      setFacilityCategories(res.data || []);
    } catch (error) {
      console.error("Error fetching facility categories:", error.message);
    }
  };

  const fetchReports = async () => {
    try {
      // Fetch only this student's damage reports
      const res = await axios.get(`${API_BASE_URL}/furniture/furniture/damage-reports/student/${studentId}`);
      setMyDamageReports(res.data || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching reports:", error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFurniture();
    fetchFacilities();
    fetchFacilityCategories();
    if (studentId) {
      fetchReports();
    }
  }, [studentId]);

  // ✅ Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.category === "Furniture") {
        await axios.post(`${API_BASE_URL}/furniture/furniture/${formData.itemId}/report-damage`, {
          student: studentId,
          description: formData.description,
        });
      } else if (formData.category === "Facility") {
        await axios.post(`${API_BASE_URL}/facility/facility/${formData.itemId}/report-damage`, {
          student: studentId,
          description: formData.description,
          facilityCategory: formData.facilityCategory
        });
      }
      alert("Damage reported successfully ✅");
      setFormData({ category: "", itemId: "", description: "", facilityCategory: "" });
      fetchReports();
    } catch (error) {
      console.error("Error reporting damage:", error.message);
    }
  };

  if (!studentId) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">📝 Report Damage</h2>
        <p className="text-red-600">Error: No student ID provided. Please log in.</p>
      </div>
    );
  }

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
            setFormData({ ...formData, category: e.target.value, itemId: "", facilityCategory: "" })
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

        {/* Facility Category (only for Facility) */}
        {formData.category === "Facility" && (
          <select
            value={formData.facilityCategory}
            onChange={e => setFormData({ ...formData, facilityCategory: e.target.value })}
            className="border rounded p-2"
            required
          >
            <option value="">Select Facility Category</option>
            {facilityCategories.map(cat => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
          </select>
        )}

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
            <option value="">Select Facility</option>
            {facilities.map((fac) => (
              <option key={fac._id} value={fac._id}>
                {fac.name} ({fac.location})
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

      {/* My Damage Reports */}
      <h3 className="text-xl font-semibold mb-4">📋 My Damage Reports</h3>
      {loading ? (
        <p className="text-gray-600">Loading reports...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 shadow">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-3">Category</th>
                <th className="border p-3">Item</th>
                <th className="border p-3">Location</th>
                <th className="border p-3">Description</th>
                <th className="border p-3">Status</th>
                <th className="border p-3">Date</th>
                <th className="border p-3">Repair Status</th>
                <th className="border p-3">Repair Update</th>
              </tr>
            </thead>
            <tbody>
              {myDamageReports.map((r, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="border p-3">{r.category?.name || r.facilityCategory?.name || "N/A"}</td>
                  <td className="border p-3">{r.furnitureName || r.facilityName || r.name}</td>
                  <td className="border p-3">{r.location}</td>
                  <td className="border p-3">{r.description}</td>
                  <td className="border p-3">
                    <span className={`px-3 py-1 rounded text-sm font-medium ${r.status === "active" ? "bg-yellow-100 text-yellow-800" : r.status === "under-repair" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"}`}>{r.status}</span>
                  </td>
                  <td className="border p-3">{r.reportedAt ? new Date(r.reportedAt).toLocaleDateString() : ""}</td>
                  <td className="border p-3">{r.repairStatus || "Pending"}</td>
                  <td className="border p-3">{r.repairUpdate || "No Update"}</td>
                </tr>
              ))}
              {myDamageReports.length === 0 && (
                <tr>
                  <td colSpan="8" className="text-center p-4 text-gray-500">
                    No damage reports submitted yet
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
