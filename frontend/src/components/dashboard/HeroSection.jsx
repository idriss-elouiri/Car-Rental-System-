import React from "react";
import { FaCar, FaCheckDouble, FaMoneyBill, FaUsers } from "react-icons/fa";
import { motion } from "framer-motion";

const HeroSection = ({
  totalCustomers,
  totalCars,
  availableCars,
  completedRentals,
  transactions,
}) => {
  return (
    <>
      <motion.div
        className="bg-gray-800 bg-opacity-50 backdrop-blur-md overflow-hidden shadow-lg rounded-xl border border-gray-700"
        whileHover={{
          y: -5,
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
        }}
      >
        <div className="px-4 py-5 sm:p-6">
          <span className="flex items-center text-sm font-medium text-gray-400">
            <FaCar size={20} className="mr-2" style={{ color: "#6366F1" }} />
            Voitures disponibles{" "}
          </span>
          <p className="mt-1 text-3xl font-semibold text-gray-100">
            {availableCars}/{totalCars}
          </p>
        </div>
      </motion.div>
      <motion.div
        className="bg-gray-800 bg-opacity-50 backdrop-blur-md overflow-hidden shadow-lg rounded-xl border border-gray-700"
        whileHover={{
          y: -5,
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
        }}
      >
        <div className="px-4 py-5 sm:p-6">
          <span className="flex items-center text-sm font-medium text-gray-400">
            <FaUsers size={20} className="mr-2" style={{ color: "#8B5CF6" }} />
            Clients{" "}
          </span>
          <p className="mt-1 text-3xl font-semibold text-gray-100">
            {totalCustomers}
          </p>
        </div>
      </motion.div>
      <motion.div
        className="bg-gray-800 bg-opacity-50 backdrop-blur-md overflow-hidden shadow-lg rounded-xl border border-gray-700"
        whileHover={{
          y: -5,
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
        }}
      >
        <div className="px-4 py-5 sm:p-6">
          <span className="flex items-center text-sm font-medium text-gray-400">
            <FaMoneyBill
              size={20}
              className="mr-2"
              style={{ color: "#10B981" }}
            />
            Transactions
          </span>
          <p className="mt-1 text-3xl font-semibold text-gray-100">
            ${transactions}
          </p>
        </div>
      </motion.div>
      <motion.div
        className="bg-gray-800 bg-opacity-50 backdrop-blur-md overflow-hidden shadow-lg rounded-xl border border-gray-700"
        whileHover={{
          y: -5,
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
        }}
      >
        <div className="px-4 py-5 sm:p-6">
          <span className="flex items-center text-sm font-medium text-gray-400">
            <FaCheckDouble
              size={20}
              className="mr-2"
              style={{ color: "#EC4899" }}
            />
            Locations terminées
          </span>
          <p className="mt-1 text-3xl font-semibold text-gray-100">
            {completedRentals}
          </p>
        </div>
      </motion.div>
    </>
  );
};

export default HeroSection;
