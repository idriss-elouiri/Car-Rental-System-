"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";

const FormCar = ({
  _id,
  name: existingName,
  carNumber: existingCarNumber,
  color: existingColor,
  vehicleYear: existingVehicleYear,
  carStatus: existingCarStatus,
}) => {
  const [formData, setFormData] = useState({
    name: existingName || "",
    carNumber: existingCarNumber || "",
    color: existingColor || "",
    vehicleYear: existingVehicleYear || "",
    carStatus: existingCarStatus || "",
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
      ? `${apiUrl}/api/car/editCar/${_id}`
      : `${apiUrl}/api/car/createCar`;

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
      name: "",
      carNumber: "",
      color: "",
      vehicleYear: "",
      carStatus: "",
    });
    router.push("/carDetails");
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="w-full max-w-lg p-8 bg-gray-800 shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold text-center text-white">
          Car Details
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-white">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter full name"
              className="bg-gray-700 text-white placeholder-gray-400 rounded-lg  w-full mt-2 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/*Car Number*/}
          <div>
            <label className="blo ck text-sm font-medium text-white">
              Car Number
            </label>
            <input
              type="text"
              name="carNumber"
              value={formData.carNumber}
              onChange={handleChange}
              placeholder="Enter address"
              className="bg-gray-700 text-white placeholder-gray-400 rounded-lg  w-full mt-2 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/*Color*/}
          <div>
            <label className="block text-sm font-medium text-white">
              Color
            </label>
            <input
              type="text"
              name="color"
              value={formData.color}
              onChange={handleChange}
              placeholder="Enter mobile number"
              className="bg-gray-700 text-white placeholder-gray-400 rounded-lg  w-full mt-2 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Vehicle Year */}
          <div>
            <label className="block text-sm font-medium text-white">
              Vehicle Year
            </label>
            <input
              type="text"
              name="vehicleYear"
              value={formData.vehicleYear}
              onChange={handleChange}
              placeholder="Enter ID card number"
              className="bg-gray-700 text-white placeholder-gray-400 rounded-lg  w-full mt-2 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Car Status */}
          <div>
            <label className="block text-sm font-medium text-white">
              Car Status
            </label>
            <select
              name="carStatus"
              value={formData.carStatus}
              onChange={handleChange}
              className="bg-gray-700 text-gray-400 placeholder-gray-400 rounded-lg  w-full mt-2 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Car Status</option>
              <option value="Available">Available</option>
              <option value="Not Available">Not Available</option>
            </select>
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

export default FormCar;
