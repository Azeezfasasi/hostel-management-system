import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '@/config/api';

export default function AnnouncementForm({ onAnnouncementCreated, editingAnnouncement, onEditComplete }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [audience, setAudience] = useState('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Populate form when editing
  useEffect(() => {
    if (editingAnnouncement) {
      setTitle(editingAnnouncement.title);
      setContent(editingAnnouncement.content);
      setAudience(editingAnnouncement.audience);
    } else {
      resetForm();
    }
  }, [editingAnnouncement]);

  const resetForm = () => {
    setTitle('');
    setContent('');
    setAudience('all');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!title.trim() || !content.trim()) {
      setError('Title and content are required');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const userId = user._id || user.id;

      if (!userId) {
        setError('User ID not found. Please log in again.');
        setLoading(false);
        return;
      }

      const payload = {
        title: title.trim(),
        content: content.trim(),
        audience,
        createdBy: userId
      };

      if (editingAnnouncement) {
        // Update existing announcement
        await axios.put(
          `${API_BASE_URL}/announcement/${editingAnnouncement._id}`,
          { title: title.trim(), content: content.trim(), audience },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setSuccess('Announcement updated successfully!');
        if (onEditComplete) onEditComplete();
      } else {
        // Create new announcement
        await axios.post(
          `${API_BASE_URL}/announcement`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setSuccess('Announcement created successfully!');
      }

      resetForm();
      if (onAnnouncementCreated) onAnnouncementCreated();

      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error details:', err.response?.data);
      setError(err.response?.data?.message || err.response?.data?.error || 'Error saving announcement');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">
        {editingAnnouncement ? 'Edit Announcement' : 'Create Announcement'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter announcement title"
            className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Content */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Content <span className="text-red-500">*</span>
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Enter announcement content"
            rows="6"
            className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Audience */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Audience
          </label>
          <select
            value={audience}
            onChange={(e) => setAudience(e.target.value)}
            className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All</option>
            <option value="students">Students Only</option>
            <option value="staff">Staff Only</option>
          </select>
        </div>

        {/* Messages */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
            <strong>Error:</strong> {error}
          </div>
        )}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg text-sm">
            <strong>Success:</strong> {success}
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:bg-blue-400 transition"
          >
            {loading ? 'Saving...' : editingAnnouncement ? 'Update' : 'Create'}
          </button>
          {editingAnnouncement && (
            <button
              type="button"
              onClick={() => {
                resetForm();
                if (onEditComplete) onEditComplete();
              }}
              className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-400 transition"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
