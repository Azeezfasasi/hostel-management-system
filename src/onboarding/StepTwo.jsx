import React, { useState } from 'react';
export default function StepTwo({ data, onNext, onBack }) {
  const [form, setForm] = useState({
    matricNumber: data.matricNumber || '',
    faculty: data.faculty || '',
    course: data.course || '',
    level: data.level || '',
  });
  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const handleSubmit = e => { e.preventDefault(); onNext(form); };
  return (
    <form onSubmit={handleSubmit} className='space-y-6'>
      <div className="w-full">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-center text-gray-800 mb-2">
          Academy Information
        </h1>
        <p className="text-sm font-medium text-gray-500 text-center mb-8">
          Please fill in your details to continue.
        </p>
      </div>

      {/* Matric Number */}
      <div>
        <label htmlFor="firstName" className="block text-sm font-medium text-gray-600 mb-1">
          Matric Number
        </label>
        <input
          name="matricNumber"
          id="matricNumber"
          value={form.matricNumber}
          onChange={handleChange}
          placeholder="e.g. A40990000"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
          required
        />
      </div>

      {/* Faculty */}
      <div>
        <label htmlFor="firstName" className="block text-sm font-medium text-gray-600 mb-1">
          Faculty
        </label>
        <input
          name="faculty"
          id="faculty"
          value={form.faculty}
          onChange={handleChange}
          placeholder="e.g. Faculty of engineering"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
          required
        />
      </div>

      {/* Course */}
      <div>
        <label htmlFor="firstName" className="block text-sm font-medium text-gray-600 mb-1">
          Course
        </label>
        <input
          name="course"
          id="course"
          value={form.course}
          onChange={handleChange}
          placeholder="e.g. Mass Communication"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
          required
        />
      </div>

      {/* Level */}
      <div>
        <label htmlFor="firstName" className="block text-sm font-medium text-gray-600 mb-1">
          Level
        </label>
        <select name="level" id="level" value={form.level} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200" required>
          <option value="">Choose Level</option>
          <option value="Level 1">Level 1</option>
          <option value="Level 2">Level 2</option>
          <option value="Level 3">Level 3</option>
          <option value="Level 4">Level 4</option>
          <option value="Level 5">Level 5</option>
        </select>
      </div>

      <div className="flex justify-between mt-4">
        {onBack && <button type="button" onClick={onBack} className="bg-gray-400 text-white px-4 py-2 rounded">Back</button>}
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Next</button>
      </div>
    </form>
  );
}
