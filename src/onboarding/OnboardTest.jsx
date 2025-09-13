import React, { useState } from 'react';

// Main application component to contain the form
export default function App() {
  const [formData, setFormData] = useState({});

  const handleNextStep = (data) => {
    // In a full application, you would pass this data to the next component
    // and update a global state. For this example, we'll just log it.
    console.log('Step 1 Data Submitted:', data);
    setFormData(data);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-lg bg-white p-8 sm:p-12 rounded-2xl shadow-xl border border-gray-200">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-center text-gray-800 mb-2">
          Personal Information
        </h1>
        <p className="text-sm font-medium text-gray-500 text-center mb-8">
          Please fill in your details to continue.
        </p>
        <StepOne data={formData} onNext={handleNextStep} />
      </div>
    </div>
  );
}

// Styled StepOne component
function StepOne({ data, onNext }) {
  const [form, setForm] = useState({
    firstName: data.firstName || '',
    lastName: data.lastName || '',
    otherName: data.otherName || '',
    gender: data.gender || '',
    dob: data.dob || '',
  });

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="firstName" className="block text-sm font-medium text-gray-600 mb-1">
          First Name
        </label>
        <input
          name="firstName"
          id="firstName"
          value={form.firstName}
          onChange={handleChange}
          placeholder="e.g., Jane"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
          required
        />
      </div>

      <div>
        <label htmlFor="lastName" className="block text-sm font-medium text-gray-600 mb-1">
          Last Name
        </label>
        <input
          name="lastName"
          id="lastName"
          value={form.lastName}
          onChange={handleChange}
          placeholder="e.g., Doe"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
          required
        />
      </div>

      <div>
        <label htmlFor="otherName" className="block text-sm font-medium text-gray-600 mb-1">
          Other Name (Optional)
        </label>
        <input
          name="otherName"
          id="otherName"
          value={form.otherName}
          onChange={handleChange}
          placeholder="e.g., Olivia"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
        />
      </div>

      <div>
        <label htmlFor="dob" className="block text-sm font-medium text-gray-600 mb-1">
          Date of Birth
        </label>
        <input
          name="dob"
          id="dob"
          type="date"
          value={form.dob}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
          required
        />
      </div>

      <div>
        <label htmlFor="gender" className="block text-sm font-medium text-gray-600 mb-1">
          Gender
        </label>
        <select
          name="gender"
          id="gender"
          value={form.gender}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
          required
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div className="mt-8">
        <button
          type="submit"
          className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-300 transform hover:scale-105"
        >
          Next
        </button>
      </div>
    </form>
  );
}
