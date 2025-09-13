import React, { useState } from 'react';
export default function StepThree({ data, onNext, onBack }) {
  const [form, setForm] = useState({
    email: data.email || '',
    phone: data.phone || '',
    address: data.address || '',
    city: data.city || '',
    state: data.state || '',
    zipCode: data.zipCode || '',
    nextOfKinName: data.nextOfKinName || '',
    nextOfKinPhone: data.nextOfKinPhone || '',
    nextOfKinRelationship: data.nextOfKinRelationship || '',
  });
  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const handleSubmit = e => { e.preventDefault(); onNext(form); };
  return (
    <form onSubmit={handleSubmit} className='space-y-6'>
      <div className="w-full">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-center text-gray-800 mb-2">
          Contact Information
        </h1>
        <p className="text-sm font-medium text-gray-500 text-center mb-8">
          Please fill in your details to continue.
        </p>
      </div>

      {/* Phone Number */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-600 mb-1">
          Email
        </label>
        <input
          name="email"
          id="email"
          value={form.email}
          readOnly
          onChange={handleChange}
          placeholder="e.g. abc@example.com"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg transition duration-200"
          required
        />
      </div>

      {/* Phone Number */}
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-600 mb-1">
          Phone Number
        </label>
        <input
          name="phone"
          id="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="e.g. 080XXXXXXXXX"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
          required
        />
      </div>

      {/* Personal address */}
      <div>
        <label htmlFor="address" className="block text-sm font-medium text-gray-600 mb-1">
          Personal Home Address
        </label>
        <input
          name="address"
          id="address"
          value={form.address}
          onChange={handleChange}
          placeholder="Enter your address details"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
          required
        />
      </div>

      {/* State */}
      <div>
        <label htmlFor="state" className="block text-sm font-medium text-gray-600 mb-1">
          State
        </label>
        <input
          name="state"
          id="state"
          value={form.state}
          onChange={handleChange}
          placeholder="Enter State"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
          required
        />
      </div>

      {/* City */}
      <div>
        <label htmlFor="city" className="block text-sm font-medium text-gray-600 mb-1">
          City
        </label>
        <input
          name="city"
          id="city"
          value={form.city}
          onChange={handleChange}
          placeholder="Enter City"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
          required
        />
      </div>

      {/* Zip Code */}
      <div>
        <label htmlFor="zipCode" className="block text-sm font-medium text-gray-600 mb-1">
          Zip Code
        </label>
        <input
          name="zipCode"
          id="zipCode"
          value={form.zipCode}
          onChange={handleChange}
          placeholder="Optional"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
        />
      </div>

      {/* Name of Next of Kin */}
      <div>
        <label htmlFor="nextOfKinName" className="block text-sm font-medium text-gray-600 mb-1">
          Name of Next of Kin
        </label>
        <input
          name="nextOfKinName"
          id="nextOfKinName"
          value={form.nextOfKinName}
          onChange={handleChange}
          placeholder="Enter name of next of kin"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
          required
        />
      </div>

      {/* Phone number of Next of Kin */}
      <div>
        <label htmlFor="nextOfKinPhone" className="block text-sm font-medium text-gray-600 mb-1">
          Phone number of Next of Kin
        </label>
        <input
          name="nextOfKinPhone"
          id="nextOfKinPhone"
          value={form.nextOfKinPhone}
          onChange={handleChange}
          placeholder="Enter phone number of next of kin"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
          required
        />
      </div>

      {/* Next of kin relationship */}
      <div>
        <label htmlFor="nextOfKinRelationship" className="block text-sm font-medium text-gray-600 mb-1">
          Relationship with Next of Kin
        </label>
        <select name="nextOfKinRelationship" id="nextOfKinRelationship" value={form.nextOfKinRelationship} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200" required>
          <option value="">Choose Relationship</option>
          <option value="Parent">Parent</option>
          <option value="Siblings">Siblings</option>
          <option value="Spouse">Spouse</option>
          <option value="Extended family">Extended family</option>
          <option value="Others">Others</option>
        </select>
      </div>

      <div className="flex justify-between mt-4">
        {onBack && <button type="button" onClick={onBack} className="bg-gray-400 text-white px-4 py-2 rounded">Back</button>}
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Next</button>
      </div>
    </form>
  );
}
