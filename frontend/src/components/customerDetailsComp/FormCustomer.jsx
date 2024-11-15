"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import Layout from "../Layout";

const FormCustomer = ({
  _id,
  fullName: existingFullName,
  address: existingAddress,
  gender: existingGender,
  mobile: existingMobile,
  idCard: existingIdCard,
}) => {
  const [formData, setFormData] = useState({
    fullName: existingFullName || "",
    address: existingAddress || "",
    gender: existingGender || "",
    mobile: existingMobile || "",
    idCard: existingIdCard || "",
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const url = _id
      ? `${apiUrl}/api/customer/editCustomer/${_id}`
      : `${apiUrl}/api/customer/createCustomer`;

    const res = await fetch(url, {
      method: _id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    if (!res.ok) {
      setLoading(false);
      return;
    }

    setFormData({
      fullName: "",
      address: "",
      gender: "",
      mobile: "",
      idCard: "",
    });
    router.push("/customerDetails");
  };
  return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="w-full max-w-lg p-8 bg-gray-800 shadow-lg rounded-lg">
          <h2 className="text-2xl font-bold text-center text-white">
            Customer Details
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-white">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter full name"
                className="bg-gray-700 text-white placeholder-gray-400 rounded-lg  w-full mt-2 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-white">
                Address
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter address"
                className="bg-gray-700 text-white placeholder-gray-400 rounded-lg  w-full mt-2 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-medium text-white">
                Gender
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="bg-gray-700 text-gray-400 placeholder-gray-400 rounded-lg  w-full mt-2 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Mobile Phone */}
            <div>
              <label className="block text-sm font-medium text-white">
                Mobile Phone
              </label>
              <input
                type="tel"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                placeholder="Enter mobile number"
                className="bg-gray-700 text-white placeholder-gray-400 rounded-lg  w-full mt-2 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* ID Card Number */}
            <div>
              <label className="block text-sm font-medium text-white">
                ID Card Number
              </label>
              <input
                type="text"
                name="idCard"
                value={formData.idCard}
                onChange={handleChange}
                placeholder="Enter ID card number"
                className="bg-gray-700 text-white placeholder-gray-400 rounded-lg  w-full mt-2 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Save Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {loading ? "Publishing..." : "Publish"}
            </button>
          </form>
        </div>
      </div>
  );
};

export default FormCustomer;
