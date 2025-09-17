import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '@/config/api';

export default function AllDamagedReportMain() {
  const [damagedReports, setDamagedReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editModal, setEditModal] = useState({ open: false, report: null, furnitureId: null });

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/furniture/furniture/damage-reports`);
      setDamagedReports(res.data);
    } catch (error) {
      console.error('Error fetching reports:', error.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchReports();
  }, []);

  // Delete a damage report
  const handleDelete = async (furnitureId, reportId) => {
    if (!window.confirm('Delete this damage report?')) return;
    try {
      await axios.delete(`${API_BASE_URL}/furniture/furniture/${furnitureId}/report/${reportId}`);
      fetchReports();
    } catch (error) {
      console.error('Error deleting report:', error.message);
      alert('Error deleting report');
    }
  };

  // Save repair info
  const handleSaveRepair = async (furnitureId, reportId, repairStatus, repairUpdate) => {
    try {
      await axios.patch(`${API_BASE_URL}/furniture/furniture/${furnitureId}/report/${reportId}/repair`, { repairStatus, repairUpdate });
      setEditModal({ open: false, report: null, furnitureId: null });
      fetchReports();
    } catch (error) {
      console.error('Error updating repair info:', error.message);
      alert('Error updating repair info');
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">All Damaged Reports</h2>
      {loading ? (
        <p className="text-gray-600">Loading reports...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 shadow">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-3">Furniture</th>
                <th className="border p-3">Location</th>
                <th className="border p-3">Reported By</th>
                <th className="border p-3">Description</th>
                <th className="border p-3">Date</th>
                <th className="border p-3">Repair Status</th>
                <th className="border p-3">Repair Update</th>
                <th className="border p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {damagedReports.map((f) => (
                f.reports.map((r, idx) => (
                  <tr key={r._id || idx} className="hover:bg-gray-50">
                    <td className="border p-3">{f.furnitureName}</td>
                    <td className="border p-3">{f.location}</td>
                    {/* <td className="border p-3">{r.student?.name || r.student || 'Unknown'}</td> */}
                    <td className="border p-3">
                    {r.student
                        ? (r.student.firstName
                            ? `${r.student.firstName} ${r.student.lastName || ''}`
                            : r.student.email || 'Unknown')
                        : 'Unknown'}
                    </td>
                    <td className="border p-3">{r.description}</td>
                    <td className="border p-3">{r.reportedAt ? new Date(r.reportedAt).toLocaleDateString() : ''}</td>
                    <td className="border p-3">{r.repairStatus || 'Pending'}</td>
                    <td className="border p-3">{r.repairUpdate || 'No Update'}</td>
                    <td className="border p-3 flex gap-2">
                      <button
                        className="text-blue-600 hover:underline text-xs"
                        onClick={() => setEditModal({ open: true, report: r, furnitureId: f.furnitureId })}
                      >Edit</button>
                      <button
                        className="text-red-600 hover:underline text-xs"
                        onClick={() => handleDelete(f.furnitureId, r._id)}
                      >Delete</button>
                    </td>
                  </tr>
                ))
              ))}
              {damagedReports.length === 0 && (
                <tr>
                  <td colSpan="8" className="text-center p-4 text-gray-500">
                    No damage reports found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit Modal */}
      {editModal.open && (
        <EditRepairModal
          report={editModal.report}
          furnitureId={editModal.furnitureId}
          onClose={() => setEditModal({ open: false, report: null, furnitureId: null })}
          onSave={handleSaveRepair}
        />
      )}
    </div>
  );
}

// Modal for editing repair info
function EditRepairModal({ report, furnitureId, onClose, onSave }) {
  const [repairStatus, setRepairStatus] = useState(report.repairStatus || 'Pending');
  const [repairUpdate, setRepairUpdate] = useState(report.repairUpdate || '');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    await onSave(furnitureId, report._id, repairStatus, repairUpdate);
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
        <h3 className="text-lg font-bold mb-4">Edit Repair Info</h3>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <select
            value={repairStatus}
            onChange={e => setRepairStatus(e.target.value)}
            className="border rounded p-2"
            required
          >
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
          <textarea
            value={repairUpdate}
            onChange={e => setRepairUpdate(e.target.value)}
            className="border rounded p-2"
            rows={3}
            placeholder="Add repair update..."
          />
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            disabled={saving}
          >{saving ? 'Saving...' : 'Save'}</button>
        </form>
      </div>
    </div>
  );
}
