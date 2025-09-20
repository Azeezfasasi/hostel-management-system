import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { UserContext } from './UserContext';
import { API_BASE_URL } from '../../../config/api';

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [loading, setLoading] = useState(!!localStorage.getItem('token'));
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [userListLoading, setUserListLoading] = useState(false);

  // Set axios default auth header
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Fetch user profile on mount if token exists
  useEffect(() => {
    if (token && !user) {
      (async () => {
        setLoading(true);
        try {
          const res = await axios.get(`${API_BASE_URL}/users/me`);
          setUser(res.data);
        } catch (err) {
          console.log(err);
          setUser(null);
          setToken('');
          localStorage.removeItem('token');
        } finally {
          setLoading(false);
        }
      })();
    }
    // eslint-disable-next-line
  }, [token]);

  // Auth actions
  const register = async (form) => {
    setLoading(true); setError(''); setSuccess('');
    try {
      const res = await axios.post(`${API_BASE_URL}/users/register`, form);
      setUser(res.data.user);
      setToken(res.data.token);
      localStorage.setItem('token', res.data.token);
      setSuccess('Registration successful!');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed.');
      throw err;
    } finally { setLoading(false); }
  };

  const login = async (form) => {
    setLoading(true); setError(''); setSuccess('');
    try {
      const res = await axios.post(`${API_BASE_URL}/users/login`, form);
      setToken(res.data.token);
      localStorage.setItem('token', res.data.token);
      // Fetch fresh user profile after login
      axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
      const profileRes = await axios.get(`${API_BASE_URL}/users/me`);
      setUser(profileRes.data);
      // Store studentId if user is a student
      if (profileRes.data.role === 'student' && profileRes.data._id) {
        localStorage.setItem('studentId', profileRes.data._id);
      } else {
        localStorage.removeItem('studentId');
      }
      setSuccess('Login successful!');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed.');
    } finally { setLoading(false); }
  };

  const logout = () => {
    setUser(null);
    setToken('');
    localStorage.removeItem('token');
    setSuccess('Logged out.');
  };

  // Profile actions
  const fetchProfile = async () => {
    setLoading(true); setError('');
    try {
      const res = await axios.get(`${API_BASE_URL}/users/me`);
      setUser(res.data);
    } catch (err) {
        console.log(err);
      setError('Failed to fetch profile.');
    } finally { setLoading(false); }
  };

  const updateProfile = async (updates) => {
    setLoading(true); setError(''); setSuccess('');
    try {
      const res = await axios.put(`${API_BASE_URL}/users/me`, updates);
      setUser(res.data);
      setSuccess('Profile updated!');
    } catch (err) {
        console.log(err);
      setError('Failed to update profile.');
    } finally { setLoading(false); }
  };

  // Admin actions
  const getAllUsers = async () => {
  setUserListLoading(true); setError('');
  try {
    const res = await axios.get(`${API_BASE_URL}/users`);
    return res.data;
  } catch (err) {
    console.log(err);
    setError('Failed to fetch users.');
    return [];
  } finally {
    setUserListLoading(false);
  }
};

  const editUser = async (id, updates) => {
    setLoading(true); setError(''); setSuccess('');
    try {
      const res = await axios.put(`${API_BASE_URL}/users/${id}`, updates);
      setSuccess('User updated!');
      return res.data;
    } catch (err) {
        console.log(err);
      setError('Failed to update user.');
    } finally { setLoading(false); }
  };

  const deleteUser = async (id) => {
    setLoading(true); setError(''); setSuccess('');
    try {
      await axios.delete(`${API_BASE_URL}/users/${id}`);
      setSuccess('User deleted!');
    } catch (err) {
        console.log(err);
      setError('Failed to delete user.');
    } finally { setLoading(false); }
  };

  const disableUser = async (id) => {
    setLoading(true); setError(''); setSuccess('');
    try {
      await axios.patch(`${API_BASE_URL}/users/${id}/disable`);
      setSuccess('User disabled!');
    } catch (err) {
        console.log(err);
      setError('Failed to disable user.');
    } finally { setLoading(false); }
  };

  // Role helpers
  const isSuperAdmin = user?.role === 'super admin';
  const isAdmin = user?.role === 'admin' || isSuperAdmin;
  const isStudent = user?.role === 'student';
  const isStaff = user?.role === 'staff';

  return (
    <UserContext.Provider value={{
      user, token, loading, setLoading, error, success,
      register, login, logout, fetchProfile, updateProfile,
      getAllUsers, editUser, deleteUser, disableUser,
      isSuperAdmin, isAdmin, isStudent, isStaff, userListLoading
    }}>
      {children}
    </UserContext.Provider>
  );
};