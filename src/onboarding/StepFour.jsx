import React, { useState, useRef } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '@/config/api';
export default function StepFour({ data, onNext, onBack, isLast }) {
  const [form, setForm] = useState({
    nin: data.nin || '',
    bio: data.bio || '',
    campusName: data.campusName || '',
    profileImage: data.profileImage || '', // This will be the URL
  });
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState(form.profileImage);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef();

  // Upload image to backend and set URL
  const uploadImage = async (file) => {
    setUploading(true);
    setUploadError('');
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('profileImage', file);
      const res = await axios.post(`${API_BASE_URL}/users/upload-profile-image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      });
      setForm(f => ({ ...f, profileImage: res.data.url }));
      setPreview(res.data.url);
    } catch {
      setUploadError('Failed to upload image. Please try again.');
    }
    setUploading(false);
  };

  const handleChange = e => {
    const { name, value, files } = e.target;
    if (name === 'profileImage' && files && files[0]) {
      setPreview(URL.createObjectURL(files[0]));
      uploadImage(files[0]);
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  };

  const handleDragOver = e => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };
  const handleDragLeave = e => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };
  const handleDrop = e => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setPreview(URL.createObjectURL(e.dataTransfer.files[0]));
      uploadImage(e.dataTransfer.files[0]);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = e => { e.preventDefault(); onNext(form); };

  return (
    <form onSubmit={handleSubmit} className='space-y-6'>
      <div className="w-full">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-center text-gray-800 mb-2">
          Other Information
        </h1>
        <p className="text-sm font-medium text-gray-500 text-center mb-8">
          Please fill in your details to continue.
        </p>
      </div>

      {/* NIN */}
      <div>
        <label htmlFor="nin" className="block text-sm font-medium text-gray-600 mb-1">
          NIN <span className='text-red-700 text-[16px]'>*</span>
        </label>
        <input
          name="nin"
          id="nin"
          value={form.nin}
          onChange={handleChange}
          placeholder="e.g. 7890XXXXXXXX"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
          required
        />
      </div>

      {/* Campus */}
      <div>
        <label htmlFor="campusName" className="block text-sm font-medium text-gray-600 mb-1">
          Campus Name <span className='text-red-700 text-[16px]'>*</span>
        </label>
        <input
          name="campusName"
          id="campusName"
          value={form.campusName}
          onChange={handleChange}
          placeholder="Enter your campus name"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
          required
        />
      </div>

      {/* Profile Image Upload with Preview and Drag & Drop */}
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">Your Photo <span className='text-red-700 text-[16px]'>*</span></label>
        <div
          className={`w-full flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-4 cursor-pointer transition ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-white'}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleImageClick}
        >
          {preview ? (
            <img src={preview} alt="Profile Preview" className="w-24 h-24 rounded-full object-cover mb-2 border-2 border-blue-400" />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-3xl text-gray-500 mb-2 border-2 border-gray-300">
              <span>+</span>
            </div>
          )}
          <span className="text-xs text-gray-500">Drag & drop or click to upload</span>
          <input
            type="file"
            name="profileImage"
            id="profileImage"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleChange}
            disabled={uploading}
          />
        </div>
        {uploading && <div className="text-xs text-blue-600 mt-2">Uploading...</div>}
        {uploadError && <div className="text-xs text-red-600 mt-2">{uploadError}</div>}
      </div>

      <div className="flex justify-between mt-4">
        {onBack && <button type="button" onClick={onBack} className="bg-gray-400 text-white px-4 py-2 rounded">Back</button>}
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded" disabled={uploading}>{isLast ? 'Finish' : 'Next'}</button>
      </div>
    </form>
  );
}
