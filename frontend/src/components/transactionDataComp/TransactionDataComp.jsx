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
import Layout from "../Layout";
import { useSelector } from "react-redux";

const TransactionDataComp = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [transactions, setTransactions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [transactionIdToDelete, settransactionIdToDelete] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();
  const isAdmin = currentUser?.isAdmin;
  const isStaff = currentUser?.isStaff;
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

  return (
    <Layout>
      <div className="flex-1 overflow-auto relative z-10">
        <Header title="Locations" />

        <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
          <motion.div
            className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex justify-between items-center w-full mb-4">
              <h2 className="text-xl font-semibold text-gray-100">
                Données des transactions
              </h2>

              <Link
                href="/transactionData/newTransaction"
                className="inline-flex items-center px-4 py-2 border border-green-500 text-green-500 rounded-md hover:bg-green-500 hover:text-white transition"
              >
                + Ajouter une nouvelle transaction
              </Link>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
              <div className="relative w-full sm:w-auto">
                <input
                  type="text"
                  placeholder="Rechercher des transactions..."
                  className="w-full bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="bg-gray-700 text-white rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {[10, 20, 30].map((value) => (
                  <option key={value} value={value}>
                    Afficher {value} entrées
                  </option>
                ))}
              </select>
            </div>

            {loading ? (
              <p>Chargement des transactions...</p>
            ) : errorMessage ? (
              <p className="text-red-600">{errorMessage}</p>
            ) : isAdmin || isStaff ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                  <thead>
                    <tr>
                      {[
                        "#",
                        "Client/Véhicule",
                        "Emprunt/Retour",
                        "Prix",
                        "Amende P.J.",
                        "Retourné",
                        "Pénalité",
                        "Actions",
                      ].map((header, index) => (
                        <th
                          key={index}
                          className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
                        >
                          {header}
                        </th>
                      ))}
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
                              <FaUser />
                              <span>{transaction.customerName}</span>
                            </div>
                            <div className="h-px bg-gray-200"></div>
                            <div className="flex items-center gap-2">
                              <FaCar />
                              <span>{transaction.carName}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          <span>{transaction.borrowDate}</span>
                          <div className="h-px bg-gray-200 my-2"></div>
                          <span>{transaction.returnDate}</span>
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
                           <button className="p-2 bg-green-600 rounded-lg">Terminé</button> 
                          ) : (
                            <>
                              <button
                                className="text-indigo-400 hover:text-indigo-300 mr-2"
                                onClick={() =>
                                  router.push(
                                    `/transactionData/${transaction._id}/editTransaction`
                                  )
                                }
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
                <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-4">
                  <p>
                    Affichage {startIndex + 1} à{" "}
                    {Math.min(startIndex + entriesPerPage, filteredData.length)}{" "}
                    de {filteredData.length} entrées
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={handlePrevPage}
                      disabled={currentPage === 1}
                      className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition"
                    >
                      Précédent
                    </button>
                    <button
                      onClick={handleNextPage}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition"
                    >
                      Suivant
                    </button>
                  </div>
                </div>
                {showModal && (
                  <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-md p-6 max-w-md w-full">
                      <HiOutlineExclamationCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                      <h3 className="text-lg text-center text-gray-700">
                        Êtes-vous sûr de vouloir supprimer cette transaction ?
                      </h3>
                      <div className="mt-6 flex justify-center gap-4">
                        <button
                          onClick={() =>
                            handleDeleteTransaction(transactionIdToDelete)
                          }
                          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                        >
                          Oui, je suis sûr
                        </button>
                        <button
                          onClick={() => setShowModal(false)}
                          className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                        >
                          Non, annuler
                        </button>
                      </div>
                    </div>
                  </div>
                )}{" "}
              </div>
            ) : (
              <p className="text-gray-500 text-center mt-4">
                Vous n'avez pas encore de transactions !
              </p>
            )}
          </motion.div>
        </main>
      </div>
    </Layout>
  );
};

export default TransactionDataComp;
