import { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../context-api/user-context/UserContext';
import { FaLock, FaUnlock, FaEye, FaEyeSlash, FaCheck, FaTimes, FaInfoCircle, FaShieldAlt, FaUserCog, FaSearch } from 'react-icons/fa';
import axios from 'axios';
import { API_BASE_URL } from '../../../config/api';

function ChangeUserPasswordMain() {
  const { token, isAdmin, isSuperAdmin } = useContext(UserContext);
  const [formData, setFormData] = useState({
    currentPassword: '',  // Only used for current user
    newPassword: '',
    confirmPassword: ''
  });
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [isAdminMode, setIsAdminMode] = useState(false);

  // Password strength indicators
  const strengthLabels = ['Weak', 'Fair', 'Good', 'Strong'];
  const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500'];

  // Fetch users if admin
  useEffect(() => {
    if (isAdmin || isSuperAdmin) {
      fetchUsers();
    }
  }, [isAdmin , isSuperAdmin]);

  // Set admin mode based on user role
  useEffect(() => {
    setIsAdminMode(isAdmin || isSuperAdmin);
  }, [isAdmin , isSuperAdmin]);
  
  // Filter users based on search term
  useEffect(() => {
    if (users.length > 0) {
      const filtered = users.filter(user => 
        user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [searchTerm, users]);

  const fetchUsers = async () => {
    setIsLoadingUsers(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data);
      setFilteredUsers(response.data);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load users. Please try again.');
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear field-specific validation error when user types
    if (validationErrors[name]) {
      setValidationErrors({
        ...validationErrors,
        [name]: ''
      });
    }

    // Calculate password strength for new password
    if (name === 'newPassword') {
      calculatePasswordStrength(value);
    }
  };

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    
    // Length check
    if (password.length >= 8) strength += 1;
    
    // Complexity checks
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    
    // Adjust final strength (0-3 scale)
    setPasswordStrength(Math.min(3, strength));
  };

  const validateForm = () => {
    const errors = {};
    
    // Current password only required when changing own password
    if (!isAdminMode || (isAdminMode && !selectedUser)) {
      if (!formData.currentPassword) {
        errors.currentPassword = 'Current password is required';
      }
    }
    
    if (!formData.newPassword) {
      errors.newPassword = 'New password is required';
    } else if (formData.newPassword.length < 8) {
      errors.newPassword = 'Password must be at least 8 characters';
    }
    
    if (formData.newPassword !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    // Only check for same password when changing own password
    if (!isAdminMode || (isAdminMode && !selectedUser)) {
      if (formData.currentPassword === formData.newPassword) {
        errors.newPassword = 'New password must be different from current password';
      }
    }
    
    // In admin mode, a user must be selected
    if (isAdminMode && !selectedUser) {
      errors.user = 'Please select a user';
    }
    
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    // Validate form
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    
    setLoading(true);
    
    try {
      if (isAdminMode && selectedUser) {
        // Admin changing another user's password
        await axios.put(
          `${API_BASE_URL}/users/${selectedUser._id}/reset-password`, 
          {
            newPassword: formData.newPassword
          },
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        
        setSuccess(`Password for ${selectedUser.name} changed successfully!`);
      } else {
        // User changing own password
        await axios.put(
          `${API_BASE_URL}/users/change-password`, 
          {
            currentPassword: formData.currentPassword,
            newPassword: formData.newPassword
          },
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        
        setSuccess('Your password changed successfully!');
      }
      
      // Reset form
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setPasswordStrength(0);
      
      // Clear selected user if in admin mode
      if (isAdminMode) {
        setSelectedUser(null);
      }
      
    } catch (err) {
      console.error('Error changing password:', err);
      setError(err.response?.data?.error || 'Failed to change password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setSearchTerm('');
  };

  const toggleMode = () => {
    setIsAdminMode(!isAdminMode);
    setSelectedUser(null);
    setFormData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setValidationErrors({});
    setSuccess('');
    setError('');
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-xl mx-auto">
      <div className="flex items-center mb-6">
        <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
          <FaShieldAlt size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            {isAdminMode && selectedUser 
              ? `Change Password for ${selectedUser.firstName} ${selectedUser.lastName}` 
              : "Change Password"}
          </h2>
          {isAdmin && (
            <p className="text-sm text-gray-500 mt-1">
              {isAdminMode 
                ? "Admin mode: Change password for any user" 
                : "Personal mode: Change your own password"}
            </p>
          )}
        </div>
      </div>

      {/* Mode toggle for admins */}
      {isAdmin && (
        <div className="mb-6">
          <button
            type="button"
            onClick={toggleMode}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FaUserCog className="mr-2" />
            {isAdminMode ? "Switch to Personal Mode" : "Switch to Admin Mode"}
          </button>
        </div>
      )}

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-md mb-6 flex items-start">
          <FaTimes className="mt-1 mr-2 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="bg-green-50 text-green-700 p-4 rounded-md mb-6 flex items-start">
          <FaCheck className="mt-1 mr-2 flex-shrink-0" />
          <span>{success}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* User Selection (Admin Mode) */}
        {isAdminMode && (
          <div>
            <label htmlFor="userSearch" className="block text-sm font-medium text-gray-700 mb-1">
              Select User
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                id="userSearch"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search users by name or email"
                className={`w-full pl-10 pr-3 py-2 border ${
                  validationErrors.user ? 'border-red-500' : 'border-gray-300'
                } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
            </div>
            
            {validationErrors.user && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <FaTimes className="mr-1" />
                {validationErrors.user}
              </p>
            )}
            
            {searchTerm && filteredUsers.length > 0 && (
              <div className="mt-2 max-h-60 overflow-y-auto border border-gray-200 rounded-md shadow-sm">
                {filteredUsers.map(user => (
                  <button
                    key={user._id}
                    type="button"
                    onClick={() => handleUserSelect(user)}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
                  >
                    <div className="font-medium">{user.firstName}</div>
                    <div className="font-medium">{user.lastName}</div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </button>
                ))}
              </div>
            )}
            
            {selectedUser && (
              <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{selectedUser.firstName}</p>
                    <p className="font-medium">{selectedUser.lastName}</p>
                    <p className="text-sm text-gray-600">{selectedUser.email}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedUser(null)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Change
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Current Password (only for own password change) */}
        {(!isAdminMode || (isAdminMode && !selectedUser)) && (
          <div>
            <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Current Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FaLock className="text-gray-400" />
              </div>
              <input
                type={showCurrentPassword ? "text" : "password"}
                id="currentPassword"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                className={`w-full pl-10 pr-10 py-2 border ${
                  validationErrors.currentPassword ? 'border-red-500' : 'border-gray-300'
                } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="Enter current password"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              >
                {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {validationErrors.currentPassword && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <FaTimes className="mr-1" />
                {validationErrors.currentPassword}
              </p>
            )}
          </div>
        )}

        {/* New Password */}
        <div>
          <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
            {isAdminMode && selectedUser ? `New Password for ${selectedUser.name}` : "New Password"}
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FaUnlock className="text-gray-400" />
            </div>
            <input
              type={showNewPassword ? "text" : "password"}
              id="newPassword"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              className={`w-full pl-10 pr-10 py-2 border ${
                validationErrors.newPassword ? 'border-red-500' : 'border-gray-300'
              } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="Enter new password"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
              onClick={() => setShowNewPassword(!showNewPassword)}
            >
              {showNewPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {validationErrors.newPassword && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <FaTimes className="mr-1" />
              {validationErrors.newPassword}
            </p>
          )}
          
          {/* Password strength meter */}
          {formData.newPassword && (
            <div className="mt-2">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-gray-500">Password Strength:</span>
                <span className={`text-xs font-medium ${
                  passwordStrength === 0 ? 'text-red-500' :
                  passwordStrength === 1 ? 'text-orange-500' :
                  passwordStrength === 2 ? 'text-yellow-600' :
                  'text-green-600'
                }`}>{strengthLabels[passwordStrength]}</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${strengthColors[passwordStrength]} transition-all duration-300`}
                  style={{ width: `${(passwordStrength + 1) * 25}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
            Confirm New Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FaUnlock className="text-gray-400" />
            </div>
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`w-full pl-10 pr-10 py-2 border ${
                validationErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'
              } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="Confirm new password"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {validationErrors.confirmPassword && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <FaTimes className="mr-1" />
              {validationErrors.confirmPassword}
            </p>
          )}
        </div>

        {/* Password requirements */}
        <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
          <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
            <FaInfoCircle className="mr-1 text-blue-500" />
            Password Requirements:
          </h3>
          <ul className="space-y-1 text-xs text-gray-600">
            <li className="flex items-start">
              <span className={`mr-1 mt-0.5 ${formData.newPassword.length >= 8 ? 'text-green-500' : 'text-gray-400'}`}>
                {formData.newPassword.length >= 8 ? <FaCheck /> : '•'}
              </span>
              At least 8 characters
            </li>
            <li className="flex items-start">
              <span className={`mr-1 mt-0.5 ${/[A-Z]/.test(formData.newPassword) ? 'text-green-500' : 'text-gray-400'}`}>
                {/[A-Z]/.test(formData.newPassword) ? <FaCheck /> : '•'}
              </span>
              At least one uppercase letter
            </li>
            <li className="flex items-start">
              <span className={`mr-1 mt-0.5 ${/[0-9]/.test(formData.newPassword) ? 'text-green-500' : 'text-gray-400'}`}>
                {/[0-9]/.test(formData.newPassword) ? <FaCheck /> : '•'}
              </span>
              At least one number
            </li>
            <li className="flex items-start">
              <span className={`mr-1 mt-0.5 ${/[^A-Za-z0-9]/.test(formData.newPassword) ? 'text-green-500' : 'text-gray-400'}`}>
                {/[^A-Za-z0-9]/.test(formData.newPassword) ? <FaCheck /> : '•'}
              </span>
              At least one special character
            </li>
          </ul>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className={`w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer ${
              loading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Updating Password...
              </>
            ) : (
              isAdminMode && selectedUser ? `Set Password for ${selectedUser.name}` : 'Change Password'
            )}
          </button>
        </div>
      </form>

      <div className="mt-6 text-center">
        <p className="text-xs text-gray-500">
          {isAdminMode 
            ? "As an administrator, you can reset passwords for any user in the system." 
            : "Your password is securely stored and never shared with third parties."}
        </p>
      </div>
    </div>
  );
}

export default ChangeUserPasswordMain;