import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '@/config/api';
import AnnouncementForm from './AnnouncementForm';

export default function AllAnnouncements() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAudience, setFilterAudience] = useState('all');

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/announcement`);
      setAnnouncements(response.data);
    } catch (error) {
      console.error('Error fetching announcements:', error);
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this announcement?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE_URL}/announcement/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAnnouncements(announcements.filter(a => a._id !== id));
    } catch (error) {
      console.error('Error deleting announcement:', error);
      alert('Error deleting announcement');
    }
  };

  const filteredAnnouncements = announcements.filter(announcement => {
    const matchesSearch = 
      announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      announcement.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAudience = filterAudience === 'all' || announcement.audience === filterAudience;
    return matchesSearch && matchesAudience;
  });

  return (
    <div className="space-y-8">
      {/* Form Section */}
      <AnnouncementForm 
        onAnnouncementCreated={fetchAnnouncements}
        editingAnnouncement={editingAnnouncement}
        onEditComplete={() => {
          setEditingAnnouncement(null);
          fetchAnnouncements();
        }}
      />

      {/* Announcements List Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-6">All Announcements</h2>

        {/* Search and Filter */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <input
              type="text"
              placeholder="Search announcements..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <select
              value={filterAudience}
              onChange={(e) => setFilterAudience(e.target.value)}
              className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Audiences</option>
              <option value="all">All</option>
              <option value="students">Students Only</option>
              <option value="staff">Staff Only</option>
            </select>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <p className="text-gray-600 text-center py-8">Loading announcements...</p>
        ) : filteredAnnouncements.length === 0 ? (
          <p className="text-gray-600 text-center py-8">No announcements found</p>
        ) : (
          <div className="space-y-4">
            {filteredAnnouncements.map((announcement) => (
              <div key={announcement._id} className="border rounded-lg p-4 hover:shadow-md transition">
                {/* Header */}
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800">{announcement.title}</h3>
                    <div className="flex gap-2 mt-1">
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {announcement.audience === 'all' ? 'All' : announcement.audience === 'students' ? 'Students' : 'Staff'}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(announcement.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingAnnouncement(announcement)}
                      className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(announcement._id)}
                      className="text-red-600 hover:text-red-800 font-medium text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {/* Content */}
                <p className="text-gray-700 text-sm line-clamp-3">{announcement.content}</p>

                {/* Creator Info */}
                <div className="mt-3 text-xs text-gray-500">
                  Created by: {announcement.createdBy?.firstName} {announcement.createdBy?.lastName}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
