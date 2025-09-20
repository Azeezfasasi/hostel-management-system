import React, { useState } from 'react';
import axios from 'axios';
import { useUser } from '@/assets/context-api/user-context/UseUser';
import { API_BASE_URL } from '@/config/api';

const categories = [
  { value: 'maintenance', label: 'Maintenance' },
  { value: 'electricity', label: 'Electricity' },
  { value: 'security', label: 'Security' },
  { value: 'other', label: 'Other' },
];

export default function SendComplaintsMain() {
  const { user } = useUser();
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!category || !description) {
      setError('Please select a category and enter a description.');
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/complaint`, {
        student: user._id,
        category,
        description,
      });
      setSuccess('Complaint submitted successfully!');
      setCategory('');
      setDescription('');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Error submitting complaint.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-md mt-8">
      <h2 className="text-2xl font-bold mb-6 text-blue-900">Send a Complaint</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block mb-2 font-medium text-gray-700">Category</label>
          <select
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={category}
            onChange={e => setCategory(e.target.value)}
            required
          >
            <option value="">Select category</option>
            {categories.map(cat => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-2 font-medium text-gray-700">Description</label>
          <textarea
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={5}
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Describe your complaint..."
            required
          />
        </div>
        {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
        {success && <div className="text-green-600 text-sm mb-2">{success}</div>}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Submit Complaint'}
        </button>
      </form>
    </div>
  );
}
