"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Layout from "../Layout";

const FormTransaction = ({
  _id,
  customerName: existingCustomerName,
  carName: existingCarName,
  borrowDate: existingBorrowDate,
  returnDate: existingReturnDate,
  perDayPrice: existingPerDayPrice,
  dateOfReturn: existingDateOfReturn,
  totalPrice: existingTotalPrice,
  isCompleted: existingIsCompleted,
}) => {
  const [customers, setCustomers] = useState([]);
  const [cars, setCars] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    customerName: existingCustomerName || "",
    carName: existingCarName || "",
    borrowDate: existingBorrowDate || "",
    returnDate: existingReturnDate || "",
    perDayPrice: existingPerDayPrice || "",
    dateOfReturn: existingDateOfReturn || "",
    totalPrice: existingTotalPrice || "",
    totalPenalty: "",
    isCompleted: existingIsCompleted || false,
  });
  console.log(formData);
  const router = useRouter();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  console.log(formData);
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/customer/getCustomers`, {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();
        setCustomers(data.customers);
      } catch (error) {
        console.error("Error fetching customers:", error);
        setErrorMessage("Failed to load customers.");
      }
    };
    const fetchCars = async () => {
      setLoading(true); // Start loading
      try {
        const res = await fetch(`${apiUrl}/api/car/getCars`, {
          method: "GET",
        });
        const data = await res.json();
        if (res.ok) {
          setCars(data.cars);
        } else {
          console.error(data.message);
        }
      } catch (error) {
        console.error("Error fetching cars:", error);
      } finally {
        setLoading(false); // Stop loading
      }
    };
    fetchCars();
    fetchCustomers();
  }, [apiUrl]);

  const handleCustomerChange = (e) => {
    const selectedCustomerName = e.target.value;

    setFormData((prevData) => ({
      ...prevData,
      customerName: selectedCustomerName,
    }));
  };

  const handleCarChange = (e) => {
    const selectedCarName = e.target.value;

    setFormData((prevData) => ({
      ...prevData,
      carName: selectedCarName,
    }));
  };

  const handleInputChange = (e) => {
    const { id, value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: id === "isCompleted" ? checked : value,
    }));

    // Clear error message on input change
    setErrorMessage(null);
  };

  const calculateTotalPrice = () => {
    if (formData.borrowDate && formData.returnDate && formData.perDayPrice) {
      const borrow = new Date(formData.borrowDate);
      const returnDateObj = new Date(formData.returnDate);
      const daysDiff = (returnDateObj - borrow) / (1000 * 3600 * 24);

      if (daysDiff > 0) {
        setFormData((prevData) => ({
          ...prevData,
          totalPrice: daysDiff * formData.perDayPrice,
        }));
      } else {
        setFormData((prevData) => ({ ...prevData, totalPrice: 0 }));
      }
    }
  };

  const calculateTotalPenalty = () => {
    if (formData.dateOfReturn && formData.returnDate && formData.perDayPrice) {
      const dateOfReturn = new Date(formData.dateOfReturn);
      const returnDateObj = new Date(formData.returnDate);
      const daysDiff = (dateOfReturn - returnDateObj) / (1000 * 3600 * 24);

      if (daysDiff > 0) {
        setFormData((prevData) => ({
          ...prevData,
          totalPenalty: daysDiff * formData.perDayPrice,
        }));
      } else {
        setFormData((prevData) => ({ ...prevData, totalPenalty: 0 }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const selectedCar = cars.find((car) => car.name === formData.carName);
    console.log("Selected Car:", selectedCar);

    if (!selectedCar || selectedCar.carStatus === "Not Available") {
      if (!formData.isCompleted) {
        setError("السيارة غير متاحة");
        setLoading(false);
        return;
      }
    }

    const url = _id
      ? `${apiUrl}/api/transaction/editTransaction/${_id}`
      : `${apiUrl}/api/transaction/createTransaction`;

    try {
      const res = await fetch(url, {
        method: _id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setLoading(false);
        setError(data.message || "Something went wrong.");
        return;
      }

      setFormData({
        customerName: "",
        carName: "",
        borrowDate: "",
        returnDate: "",
        perDayPrice: "",
        totalPrice: "",
      });
      router.push("/transactionData");
    } catch (error) {
      setLoading(false);
      console.error("Error submitting transaction:", error);
      setError("An error occurred while submitting the transaction.");
    }
  };
  return (
      <div className="min-h-screen bg-gray-900 p-8 ">
        <div className="w-full max-w-2xl mx-auto bg-gray-800 shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-bold text-white mb-4">
            New Transaction
          </h2>

          {/* Transaction Form */}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="customerName"
                className="block text-sm font-medium text-white"
              >
                Customer Name
              </label>
              <select
                id="customerName"
                value={formData.customerName}
                onChange={handleCustomerChange}
                className="bg-gray-700 text-gray-400 placeholder-gray-400 rounded-lg  w-full mt-2 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Customer</option>
                {customers.map((customer) => (
                  <option key={customer._id} value={customer.fullName}>
                    {customer.fullName}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label
                htmlFor="carName"
                className="block text-sm font-medium text-white"
              >
                Car Name
              </label>
              <select
                id="carName"
                value={formData.carName}
                onChange={handleCarChange}
                className="bg-gray-700 text-gray-400 rounded-lg  w-full mt-2 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Car</option>
                {cars.map((car) => (
                  <option key={car._id} value={car.name}>
                    {car.name} -{" "}
                    {car.carStatus === "Available"
                      ? "Available"
                      : "Not Available"}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label htmlFor="borrowDate" className="block text-white">
                Borrow Date
              </label>
              <input
                type="date"
                id="borrowDate"
                value={formData.borrowDate}
                onChange={handleInputChange}
                className="bg-gray-700 text-gray-400 placeholder-gray-400 rounded-lg  w-full mt-2 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="returnDate" className="block text-white">
                Return Date
              </label>
              <input
                type="date"
                id="returnDate"
                value={formData.returnDate}
                onChange={handleInputChange}
                className="bg-gray-700 text-gray-400 placeholder-gray-400 rounded-lg  w-full mt-2 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="perDayPrice" className="block text-white">
                Price per Day
              </label>
              <input
                type="number"
                id="perDayPrice"
                value={formData.perDayPrice}
                onChange={handleInputChange}
                onBlur={calculateTotalPrice}
                className="bg-gray-700 text-gray-400 placeholder-gray-400 rounded-lg  w-full mt-2 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter price per day"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="totalPrice" className="block text-white">
                Total Price
              </label>
              <input
                type="text"
                id="totalPrice"
                value={`$${formData.totalPrice}`}
                disabled
                className="bg-gray-700 text-gray-400 placeholder-gray-400 rounded-lg  w-full mt-2 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {_id ? (
              <div className="mb-4">
                <label htmlFor="dateOfReturn" className="block text-white">
                  Date Of Return
                </label>
                <input
                  type="date"
                  id="dateOfReturn"
                  value={formData.dateOfReturn}
                  onChange={handleInputChange}
                  onBlur={calculateTotalPenalty}
                  className="bg-gray-700 text-gray-400 placeholder-gray-400 rounded-lg  w-full mt-2 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            ) : (
              ""
            )}
            {/* Checkbox Field */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isCompleted"
                checked={formData.isCompleted}
                onChange={handleInputChange}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-700 bg-gray-700   rounded"
              />
              <label htmlFor="isCompleted" className="text-sm text-white">
                Is Completed
              </label>
            </div>
            {error && <p style={{ color: "red" }}>{error}</p>}

            {/* Save Button */}
            <div className="mb-4 flex justify-center">
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200 mt-5"
              >
                Save Transaction
              </button>
            </div>
          </form>
        </div>
      </div>
  );
};

export default FormTransaction;
