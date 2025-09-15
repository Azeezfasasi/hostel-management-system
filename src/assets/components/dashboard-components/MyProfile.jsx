import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../context-api/user-context/UserContext';

function MyProfile() {
  const { user, loading, error, success, updateProfile } = useContext(UserContext);
  const [formData, setFormData] = useState({
    matricNumber: '',
    firstName: '',
    lastName: '',
    otherName: '',
    dob: '',
    gender: '',
    emergencyContact: '',
    nextOfKinName: '',
    nextOfKinRelationship: '',
    nin: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    campusName: '',
    department: '',
    faculty: '',
    course: '',
    level: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [localSuccess, setLocalSuccess] = useState('');
  const [localError, setLocalError] = useState('');

  // Initialize form with user data when it loads
  useEffect(() => {
    if (user) {
      setFormData({
        matricNumber: user.matricNumber || '',
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        otherName: user.otherName || '',
        dob: user.dob || '',
        gender: user.gender || '',
        emergencyContact: user.emergencyContact || '',
        nextOfKinName: user.nextOfKinName || '',
        nextOfKinRelationship: user.nextOfKinRelationship || '',
        nin: user.nin || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || '',
        state: user.state || '',
        zipCode: user.zipCode || '',
        campusName: user.campusName || '',
        department: user.department || '',
        faculty: user.faculty || '',
        course: user.course || '',
        level: user.level || '',
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    setLocalSuccess('');
    
    try {
      await updateProfile(formData);
      setIsEditing(false);
      setLocalSuccess('Profile updated successfully!');
    } catch (err) {
      console.log(err);
      setLocalError('Failed to update profile. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center p-8 bg-red-50 rounded-lg">
        <p className="text-red-600">Please log in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">My Profile</h2>
      
      {(error || localError) && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4">
          {error || localError}
        </div>
      )}
      
      {(success || localSuccess) && (
        <div className="bg-green-50 text-green-600 p-3 rounded-md mb-4">
          {success || localSuccess}
        </div>
      )}

      {/* Profile Information */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-blue-600">Personal Information</h3>
          <button
            type="button"
            onClick={() => setIsEditing(!isEditing)}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              isEditing 
                ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        {!isEditing ? (
          <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-500 mb-1">Matric Number</p>
              <p className="font-medium">{user.matricNumber || 'Not provided'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">First Name</p>
              <p className="font-medium">{user.firstName || 'Not provided'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Last Name</p>
              <p className="font-medium">{user.lastName || 'Not provided'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Other Name</p>
              <p className="font-medium">{user.otherName || 'Not provided'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Date of Birth</p>
              <p className="font-medium">{user.dob || 'Not provided'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Gender</p>
              <p className="font-medium capitalize">{user.gender || 'Not provided'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Email</p>
              <p className="font-medium">{user.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">NIN</p>
              <p className="font-medium">{user.nin || 'Not provided'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Phone</p>
              <p className="font-medium">{user.phone || 'Not provided'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Address</p>
              <p className="font-medium">{user.address || 'Not provided'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">City</p>
              <p className="font-medium">{user.city || 'Not provided'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">State</p>
              <p className="font-medium">{user.state || 'Not provided'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Zip Code</p>
              <p className="font-medium">{user.zipCode || 'Not provided'}</p>
            </div>
          </div>

          <div className="flex justify-between items-center mt-6 mb-2">
            <h3 className="text-xl font-semibold text-blue-600">Next of Kin Information</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-500 mb-1">Next of Kin Name</p>
              <p className="font-medium">{user.nextOfKinName || 'Not provided'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Next of Kin Contact</p>
              <p className="font-medium">{user.emergencyContact || 'Not provided'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Relationship with Next of Kin</p>
              <p className="font-medium">{user.nextOfKinRelationship || 'Not provided'}</p>
            </div>
          </div>

          <div className="flex justify-between items-center mt-6 mb-2">
            <h3 className="text-xl font-semibold text-blue-600">Academic Information</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-500 mb-1">Campus Name</p>
              <p className="font-medium">{user.campusName || 'Not provided'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Department</p>
              <p className="font-medium">{user.department || 'Not provided'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Faculty</p>
              <p className="font-medium">{user.faculty || 'Not provided'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Course</p>
              <p className="font-medium">{user.course || 'Not provided'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Level</p>
              <p className="font-medium">{user.level || 'Not provided'} Level</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Role</p>
              <p className="font-medium capitalize">{user.role || 'User'}</p>
            </div>
          </div>
          </>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="matricNumber" className="block text-sm font-medium text-gray-700 mb-1">
                    Matric Number
                  </label>
                  <input
                    type="text"
                    id="matricNumber"
                    name="matricNumber"
                    value={formData.matricNumber}
                    onChange={handleInputChange}
                    disabled
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    disabled
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    disabled
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="otherName" className="block text-sm font-medium text-gray-700 mb-1">
                    Other Name
                  </label>
                  <input
                    type="text"
                    id="otherName"
                    name="otherName"
                    value={formData.otherName}
                    onChange={handleInputChange}
                    disabled
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="dob" className="block text-sm font-medium text-gray-700 mb-1">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    id="dob"
                    name="dob"
                    value={formData.dob}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                    Gender
                  </label>
                  <select name="gender" id="gender" value={formData.gender} onChange={handleInputChange} className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled
                  />
                  <p className="text-xs text-gray-500 mt-1 italic">Email cannot be changed</p>
                </div>
                <div>
                  <label htmlFor="nin" className="block text-sm font-medium text-gray-700 mb-1">
                    NIN
                  </label>
                  <input
                    type="text"
                    id="nin"
                    name="nin"
                    value={formData.nin}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="text"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
                    Zip Code
                  </label>
                  <input
                    type="text"
                    id="zipCode"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-between items-center mt-6 mb-2">
                <h3 className="text-xl font-semibold text-blue-600">Next of Kin Information</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="nextOfKinName" className="block text-sm font-medium text-gray-700 mb-1">
                    Next of Kin Name
                  </label>
                  <input
                    type="text"
                    id="nextOfKinName"
                    name="nextOfKinName"
                    value={formData.nextOfKinName}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="emergencyContact" className="block text-sm font-medium text-gray-700 mb-1">
                    Next of Kin Contact
                  </label>
                  <input
                    type="tel"
                    id="emergencyContact"
                    name="emergencyContact"
                    value={formData.emergencyContact}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="nextOfKinRelationship" className="block text-sm font-medium text-gray-700 mb-1">
                    Relationship with Next of Kin
                  </label>
                  <select name="nextOfKinRelationship" id="nextOfKinRelationship" value={formData.nextOfKinRelationship} onChange={handleInputChange} className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Select Relationship</option>
                    <option value="Parent">Parent</option>
                    <option value="Sibling">Sibling</option>
                    <option value="Spouse">Spouse</option>
                    <option value="Friend">Friend</option>
                    <option value="Colleague">Colleague</option>
                    <option value="Extended Family">Extended Family</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-between items-center mt-6 mb-2">
                <h3 className="text-xl font-semibold text-blue-600">Academy Information</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="campusName" className="block text-sm font-medium text-gray-700 mb-1">
                    Campus Name
                  </label>
                  <input
                    type="text"
                    id="campusName"
                    name="campusName"
                    value={formData.campusName}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
                    Department
                  </label>
                  <input
                    type="text"
                    id="department"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="faculty" className="block text-sm font-medium text-gray-700 mb-1">
                    Faculty
                  </label>
                  <input
                    type="text"
                    id="faculty"
                    name="faculty"
                    value={formData.faculty}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="course" className="block text-sm font-medium text-gray-700 mb-1">
                    Course
                  </label>
                  <input
                    type="text"
                    id="course"
                    name="course"
                    value={formData.course}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="level" className="block text-sm font-medium text-gray-700 mb-1">
                    Level
                  </label>
                  <select name="level" id="level" value={formData.level} onChange={handleInputChange} className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Select Level</option>
                    <option value="100">100 Level</option>
                    <option value="200">200 Level</option>
                    <option value="300">300 Level</option>
                    <option value="400">400 Level</option>
                    <option value="500">500 Level</option>
                  </select>
                </div>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 rounded-md text-sm font-medium text-white hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default MyProfile;