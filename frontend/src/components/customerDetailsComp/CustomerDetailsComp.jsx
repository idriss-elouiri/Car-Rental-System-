"use client";

import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import {
  FaEdit,
  FaRegUser,
  FaTrash,
  FaIdCardAlt,
  FaSearch,
} from "react-icons/fa";
import { BsFillTelephoneFill } from "react-icons/bs";
import { motion } from "framer-motion";

import Link from "next/link";
import Header from "../Header";

const CustomerDetails = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [customers, setCustomers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [customerIdToDelete, setCustomerIdToDelete] = useState("");
  const [loading, setLoading] = useState(true); // Loading state
  const router = useRouter();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true); // Start loading
      try {
        const res = await fetch(`${apiUrl}/api/customer/getCustomers`, {
          method: "GET",
        });
        const data = await res.json();
        if (res.ok) {
          setCustomers(data.customers);
        } else {
          setErrorMessage(data.message || "Failed to fetch transactions.");
        }
      } catch (error) {
        setErrorMessage(error.message);
      } finally {
        setLoading(false); // Stop loading
      }
    };
    fetchProducts();
  }, [apiUrl]);

  const handleDeleteCustomer = async () => {
    try {
      const res = await fetch(
        `${apiUrl}/api/customer/deleteCustomer/${customerIdToDelete}`,
        {
          method: "DELETE",
        }
      );
      if (res.ok) {
        setCustomers((prev) =>
          prev.filter((customer) => customer._id !== customerIdToDelete)
        );
        setShowModal(false);
      } else {
        const data = await res.json();
        console.error(data.message);
      }
    } catch (error) {
      console.error("Error deleting customer:", error);
    }
  };

  const handleEditClick = (id) => {
    router.push(`/customerDetails/${id}/editCustomer`);
  };

  // Filter data based on the search term
  const filteredData = customers?.filter(
    (customer) =>
      customer.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.mobile.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.adress.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.idCard.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination calculations
  const totalPages = Math.ceil(filteredData.length / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const currentData = filteredData.slice(
    startIndex,
    startIndex + entriesPerPage
  );

  // Handler functions
  const handleSearchChange = (e) => setSearchTerm(e.target.value);
  const handleEntriesChange = (e) => setEntriesPerPage(Number(e.target.value));
  const handleNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  if (loading) {
    return <div className="text-center">Loading Customers...</div>; // Loading state UI
  }

  return (
    <>
      <div className="flex-1 overflow-auto relative z-10">
        <Header title="Customers Section" />

        <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
          <motion.div
            className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex justify-between items-center w-full mb-2">
              <h2 className="text-xl font-semibold text-gray-100">
                Customers Details
              </h2>

              <Link
                href="/customerDetails/newCustomer"
                className="mb-4 inline-flex items-center px-4 py-2 border border-green-500 text-green-500 rounded-md hover:bg-green-500 hover:text-white"
              >
                + Add New Customer
              </Link>
            </div>
            <div className="flex justify-between items-center mb-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search customers..."
                  className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={handleSearchChange}
                  value={searchTerm}
                />
                <FaSearch
                  className="absolute left-3 top-2.5 text-gray-400"
                  size={18}
                />
              </div>
              <select
                value={entriesPerPage}
                onChange={handleEntriesChange}
                className="bg-gray-700 text-white placeholder-gray-400 rounded-lg  pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {[10, 20, 30].map((value) => (
                  <option key={value} value={value}>
                    Show {value} entries
                  </option>
                ))}
              </select>
            </div>
            {loading ? (
              <p>Loading customers...</p>
            ) : errorMessage ? (
              <p className="text-red-600">{errorMessage}</p>
            ) : (
              ""
            )}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      #
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Full Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Gender
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Contact | ID Card
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Address
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-700">
                  {currentData.map((customer, index) => (
                    <motion.tr
                      key={customer._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {" "}
                        {startIndex + index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {customer.fullName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {customer.gender}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        <div className="flex flex-col gap-4 py-1">
                          <div className="flex items-center gap-2">
                            <i>
                              <BsFillTelephoneFill />
                            </i>
                            <span>{customer.mobile}</span>
                          </div>
                          <div className="w-[50%] h-[1px] bg-gray-200"></div>
                          <div className="flex items-center gap-2">
                            <i>
                              <FaIdCardAlt />
                            </i>
                            <span>{customer.idCard}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {customer.address}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        <>
                          <button
                            className="text-indigo-400 hover:text-indigo-300 mr-2"
                            onClick={() => handleEditClick(customer._id)}
                            >
                            <FaEdit size={18} />
                          </button>
                          <button
                            className="text-red-400 hover:text-red-300"
                            onClick={() => {
                              setShowModal(true);
                              setCustomerIdToDelete(customer._id);
                            }}
                          >
                            <FaTrash size={18} />
                          </button>
                        </>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
              <div className="flex justify-between items-center mt-4">
                <p>
                  Showing {startIndex + 1} to{" "}
                  {Math.min(startIndex + entriesPerPage, filteredData.length)}{" "}
                  of {filteredData.length} entries
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                  >
                    Prev
                  </button>
                  <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                  >
                    Next
                  </button>
                </div>
              </div>
              {showModal && (
                <div className="fixed  inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-md p-6 max-w-md w-full">
                    <HiOutlineExclamationCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                    <h3 className="text-lg text-center text-gray-700">
                      Are you sure you want to delete this customer?
                    </h3>
                    <div className="mt-6 flex justify-center gap-4">
                      <button
                        onClick={() => handleDeleteCustomer(customerIdToDelete)}
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        Yes, I'm sure
                      </button>
                      <button
                        onClick={() => setShowModal(false)}
                        className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                      >
                        No, cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </main>
      </div>
    </>
  );
};

export default CustomerDetails;
