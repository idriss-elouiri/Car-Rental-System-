"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Layout from "../Layout.jsx";
import { motion } from "framer-motion";

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
    <Layout>
      <motion.div
        className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl px-6 py-8 border border-gray-700 min-h-screen w-full max-w-md md:max-w-lg lg:max-w-xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="w-full h-full px-4 bg-gray-800 shadow-lg rounded-lg flex flex-col items-center justify-center">
          <h2 className="text-2xl font-bold text-center text-white mb-6">
            Détails du client
          </h2>

          {/* Formulaire de transaction */}
          <form onSubmit={handleSubmit} className="space-y-4 w-full">
            {/* Nom du client */}
            <div>
              <label
                htmlFor="customerName"
                className="block text-sm font-medium text-white"
              >
                Nom du client
              </label>
              <select
                id="customerName"
                value={formData.customerName}
                onChange={handleCustomerChange}
                className="p-2 bg-gray-700 text-gray-400 placeholder-gray-400 rounded-lg w-full mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                aria-label="Sélectionner un client"
              >
                <option value="">Sélectionner un client</option>
                {customers.map((customer) => (
                  <option key={customer._id} value={customer.fullName}>
                    {customer.fullName}
                  </option>
                ))}
              </select>
            </div>

            {/* Nom de la voiture */}
            <div>
              <label
                htmlFor="carName"
                className="block text-sm font-medium text-white"
              >
                Nom de la voiture
              </label>
              <select
                id="carName"
                value={formData.carName}
                onChange={handleCarChange}
                className="p-2 bg-gray-700 text-gray-400 rounded-lg w-full mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                aria-label="Sélectionner une voiture"
              >
                <option value="">Sélectionner une voiture</option>
                {cars.map((car) => (
                  <option key={car._id} value={car.name}>
                    {car.name} -{" "}
                    {car.carStatus === "Available"
                      ? "Disponible"
                      : "Non disponible"}
                  </option>
                ))}
              </select>
            </div>

            {/* Date d'emprunt */}
            <div>
              <label htmlFor="borrowDate" className="block text-sm text-white">
                Date d'emprunt
              </label>
              <input
                type="date"
                id="borrowDate"
                value={formData.borrowDate}
                onChange={handleInputChange}
                className="p-2 bg-gray-700 text-gray-400 rounded-lg w-full mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Date de retour */}
            <div>
              <label htmlFor="returnDate" className="block text-sm text-white">
                Date de retour
              </label>
              <input
                type="date"
                id="returnDate"
                value={formData.returnDate}
                onChange={handleInputChange}
                className="p-2 bg-gray-700 text-gray-400 rounded-lg w-full mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Prix par jour */}
            <div>
              <label htmlFor="perDayPrice" className="block text-sm text-white">
                Prix par jour
              </label>
              <input
                type="number"
                id="perDayPrice"
                value={formData.perDayPrice}
                onChange={handleInputChange}
                onBlur={calculateTotalPrice}
                className="p-2 bg-gray-700 text-white rounded-lg w-full mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Entrez le prix par jour"
              />
            </div>

            {/* Prix total */}
            <div>
              <label htmlFor="totalPrice" className="block text-sm text-white">
                Prix total
              </label>
              <input
                type="text"
                id="totalPrice"
                value={`$${formData.totalPrice}`}
                disabled
                className="p-2 bg-gray-700 text-white rounded-lg w-full mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {_id && (
              <>
                {/* Date de retour */}
                <div>
                  <label
                    htmlFor="dateOfReturn"
                    className="block text-sm text-white"
                  >
                    Date effective de retour
                  </label>
                  <input
                    type="date"
                    id="dateOfReturn"
                    value={formData.dateOfReturn}
                    onChange={handleInputChange}
                    onBlur={calculateTotalPenalty}
                    className="p-2 bg-gray-700 text-gray-400 rounded-lg w-full mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* Statut de l'opération */}
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isCompleted"
                    checked={formData.isCompleted}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-700 bg-gray-700 rounded"
                  />
                  <label htmlFor="isCompleted" className="text-sm text-white">
                    Opération terminée
                  </label>
                </div>
              </>
            )}

            {error && <p className="text-red-500">{error}</p>}

            {/* Bouton Enregistrer */}
            <div className="flex justify-center">
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200"
              >
                Enregistrer la transaction
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </Layout>
  );
};

export default FormTransaction;
