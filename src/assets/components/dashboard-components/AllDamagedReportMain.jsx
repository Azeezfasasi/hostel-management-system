import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '@/config/api';

export default function AllDamagedReportMain() {
  const [damagedReports, setDamagedReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editModal, setEditModal] = useState({ open: false, report: null, itemId: null, reportType: null });
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchReports = async () => {
    setLoading(true);
    try {
      // Fetch furniture damage reports
      const furnitureRes = await axios.get(`${API_BASE_URL}/furniture/furniture/damage-reports`);
      const furnitureReports = (furnitureRes.data || []).map(item => ({
        ...item,
        reportType: 'Furniture',
        itemId: item.furnitureId
      }));

      // Fetch facility damage reports
      const facilityRes = await axios.get(`${API_BASE_URL}/facility/damage-reports`);
      const facilityReports = (facilityRes.data || []).map(item => ({
        ...item,
        reportType: 'Facility',
        itemId: item.facilityId
      }));

      // Combine both reports
      const allReports = [...furnitureReports, ...facilityReports];
      setDamagedReports(allReports);
    } catch (error) {
      console.error('Error fetching reports:', error.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchReports();
  }, []);

  // Flatten and filter reports
  const flattenedReports = useMemo(() => {
    return damagedReports.flatMap(item =>
      (item.reports || []).map(r => ({
        ...r,
        reportType: item.reportType,
        itemId: item.itemId,
        itemName: item.furnitureName || item.facilityName || item.name,
        location: item.location
      }))
    );
  }, [damagedReports]);

  // Apply search and filters
  const filteredReports = useMemo(() => {
    return flattenedReports.filter(report => {
      const matchesSearch = 
        report.itemName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (report.student?.firstName + ' ' + report.student?.lastName)?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType = filterType === 'All' || report.reportType === filterType;
      const matchesStatus = filterStatus === 'All' || report.repairStatus === filterStatus;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [flattenedReports, searchTerm, filterType, filterStatus]);

  // Pagination
  const totalPages = Math.ceil(filteredReports.length / itemsPerPage);
  const paginatedReports = useMemo(() => {
    const startIdx = (currentPage - 1) * itemsPerPage;
    const endIdx = startIdx + itemsPerPage;
    return filteredReports.slice(startIdx, endIdx);
  }, [filteredReports, currentPage, itemsPerPage]);

  // Delete a damage report
  const handleDelete = async (itemId, reportId, reportType) => {
    if (!window.confirm('Delete this damage report?')) return;
    try {
      if (reportType === 'Furniture') {
        await axios.delete(`${API_BASE_URL}/furniture/furniture/${itemId}/report/${reportId}`);
      } else if (reportType === 'Facility') {
        await axios.delete(`${API_BASE_URL}/facility/facility/${itemId}/report/${reportId}`);
      }
      fetchReports();
    } catch (error) {
      console.error('Error deleting report:', error.message);
      alert('Error deleting report');
    }
  };

  // Save repair info
  const handleSaveRepair = async (itemId, reportId, repairStatus, repairUpdate, reportType) => {
    try {
      if (reportType === 'Furniture') {
        await axios.patch(`${API_BASE_URL}/furniture/furniture/${itemId}/report/${reportId}/repair`, { repairStatus, repairUpdate });
      } else if (reportType === 'Facility') {
        await axios.patch(`${API_BASE_URL}/facility/facility/${itemId}/report/${reportId}/repair`, { repairStatus, repairUpdate });
      }
      setEditModal({ open: false, report: null, itemId: null, reportType: null });
      fetchReports();
    } catch (error) {
      console.error('Error updating repair info:', error.message);
      alert('Error updating repair info');
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">All Damaged Reports</h2>
      
      {/* Search and Filter Controls */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search Box */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <input
              type="text"
              placeholder="Search by item, description, location..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full border rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Type Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
            <select
              value={filterType}
              onChange={(e) => {
                setFilterType(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full border rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Types</option>
              <option value="Furniture">Furniture</option>
              <option value="Facility">Facility</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Repair Status</label>
            <select
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full border rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          {/* Results Count */}
          <div className="flex items-end">
            <div className="text-sm text-gray-600">
              Showing <span className="font-semibold">{paginatedReports.length}</span> of <span className="font-semibold">{filteredReports.length}</span> reports
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <p className="text-gray-600">Loading reports...</p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300 shadow">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border p-3">Type</th>
                  <th className="border p-3">Item</th>
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
                {paginatedReports.map((r, idx) => (
                  <tr key={r._id || idx} className="hover:bg-gray-50">
                    <td className="border p-3">
                      <span className="inline-block px-2 py-1 rounded text-xs font-semibold bg-purple-100 text-purple-800">
                        {r.reportType}
                      </span>
                    </td>
                    <td className="border p-3">{r.itemName}</td>
                    <td className="border p-3">{r.location}</td>
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
                        onClick={() => setEditModal({ open: true, report: r, itemId: r.itemId, reportType: r.reportType })}
                      >Edit</button>
                      <button
                        className="text-red-600 hover:underline text-xs"
                        onClick={() => handleDelete(r.itemId, r._id, r.reportType)}
                      >Delete</button>
                    </td>
                  </tr>
                ))}
                {paginatedReports.length === 0 && (
                  <tr>
                    <td colSpan="9" className="text-center p-4 text-gray-500">
                      {filteredReports.length === 0 ? 'No damage reports found' : 'No reports on this page'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Page <span className="font-semibold">{currentPage}</span> of <span className="font-semibold">{totalPages}</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 border rounded text-sm hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  Previous
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-2 rounded text-sm transition ${
                      currentPage === page
                        ? 'bg-blue-600 text-white'
                        : 'border hover:bg-gray-100'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 border rounded text-sm hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Edit Modal */}
      {editModal.open && (
        <EditRepairModal
          report={editModal.report}
          itemId={editModal.itemId}
          reportType={editModal.reportType}
          onClose={() => setEditModal({ open: false, report: null, itemId: null, reportType: null })}
          onSave={handleSaveRepair}
        />
      )}
    </div>
  );
}

// Modal for editing repair info
function EditRepairModal({ report, itemId, reportType, onClose, onSave }) {
  const [repairStatus, setRepairStatus] = useState(report.repairStatus || 'Pending');
  const [repairUpdate, setRepairUpdate] = useState(report.repairUpdate || '');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    await onSave(itemId, report._id, repairStatus, repairUpdate, reportType);
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
