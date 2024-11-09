"use client";

import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { motion } from "framer-motion";
import {
  FaCar,
  FaCheck,
  FaEdit,
  FaRegUser,
  FaSearch,
  FaTrash,
  FaUser,
} from "react-icons/fa";
import Link from "next/link";
import Header from "../Header";

const TransactionDataComp = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [transactions, setTransactions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [transactionIdToDelete, settransactionIdToDelete] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${apiUrl}/api/transaction/getTransactions`, {
          method: "GET",
        });
        const data = await res.json();
        if (res.ok) {
          setTransactions(data.transactions);
        } else {
          setErrorMessage(data.message || "Failed to fetch transactions.");
        }
      } catch (error) {
        setErrorMessage(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, [apiUrl]);

  const handleDeleteTransaction = async () => {
    try {
      const res = await fetch(
        `${apiUrl}/api/transaction/deleteTransaction/${transactionIdToDelete}`,
        {
          method: "DELETE",
        }
      );
      if (res.ok) {
        setTransactions((prev) =>
          prev.filter(
            (transaction) => transaction._id !== transactionIdToDelete
          )
        );
        setShowModal(false);
      } else {
        const data = await res.json();
        console.error(data.message);
      }
    } catch (error) {
      console.error("Error deleting transaction:", error);
    }
  };

  const handleEditClick = (id) => {
    router.push(`/transactionData/${id}/editTransaction`);
  };

  const filteredData = transactions?.filter(
    (transaction) =>
      transaction.customerName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      transaction.carName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const currentData = filteredData.slice(
    startIndex,
    startIndex + entriesPerPage
  );

  const handleSearchChange = (e) => setSearchTerm(e.target.value);
  const handleEntriesChange = (e) => setEntriesPerPage(Number(e.target.value));
  const handleNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  if (loading) {
    return <div className="text-center">Loading transactions...</div>;
  }
  return (
    <>
      <div className="flex-1 overflow-auto relative z-10">
        <Header title="Rentals" />

        <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
          {/* STATS */}

          {/* CHARTS */}

          <motion.div
            className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex justify-between items-center w-full mb-2">
              <h2 className="text-xl font-semibold text-gray-100">
                Transaction Data
              </h2>

              <Link
                href="/transactionData/newTransaction"
                className="mb-4 inline-flex items-center px-4 py-2 border border-green-500 text-green-500 rounded-md hover:bg-green-500 hover:text-white"
              >
                <FaRegUser className="mr-2" />
                Add New transaction
              </Link>
            </div>
            <div className="flex justify-between items-center mb-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search transactions..."
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
                      Customer/Car
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Borrow/Return
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Fine P.D
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Returned
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Penalty
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-700">
                  {currentData.map((transaction, index) => (
                    <motion.tr
                      key={transaction._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {startIndex + index + 1}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-2">
                            <i>
                              <FaUser />
                            </i>
                            <span>{transaction.customerName}</span>
                          </div>
                          <div className="w-[80%] h-[1px] bg-gray-200"></div>
                          <div className="flex items-center gap-2">
                            <i>
                              <FaCar />
                            </i>
                            <span>{transaction.carName}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        <div className="flex flex-col gap-2">
                          <span>{transaction.borrowDate}</span>
                          <div className="w-[50%] h-[1px] bg-gray-200"></div>
                          <span>{transaction.returnDate}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {transaction.totalPrice}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {transaction.perDayPrice}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {transaction.dateOfReturn}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {transaction.totalPenalty}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {transaction.isCompleted ? (
                          "completed"
                        ) : (
                          <>
                            <button
                              className="text-indigo-400 hover:text-indigo-300 mr-2"
                              onClick={() => handleEditClick(transaction._id)}
                            >
                              <FaCheck size={18} />
                            </button>
                            <button
                              className="text-red-400 hover:text-red-300"
                              onClick={() => {
                                setShowModal(true);
                                settransactionIdToDelete(transaction._id);
                              }}
                            >
                              <FaTrash size={18} />
                            </button>
                          </>
                        )}
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
                      Are you sure you want to delete this transaction?
                    </h3>
                    <div className="mt-6 flex justify-center gap-4">
                      <button
                        onClick={() =>
                          handleDeleteTransaction(transactionIdToDelete)
                        }
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

export default TransactionDataComp;
