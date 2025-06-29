"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { FaSearch } from "react-icons/fa";
import Layout from "../Layout";
import Header from "../Header";

const ReceiptComp = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const { currentUser } = useSelector((state) => state.user);
  const [transactions, setTransactions] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const isAdmin = currentUser?.isAdmin;
  const isStaff = currentUser?.isStaff;

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
        <Header title="Section des Reçus" />
        <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
          <motion.div
            className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-xl font-semibold text-gray-100 mb-5">
              Détails des Reçus
            </h2>

            <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
              <div className="relative w-full md:w-1/2 lg:w-1/3">
                <input
                  type="text"
                  placeholder="Rechercher des reçus..."
                  className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="bg-gray-700 text-white rounded-lg pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {[10, 20, 30].map((value) => (
                  <option key={value} value={value}>
                    Afficher {value} entrées
                  </option>
                ))}
              </select>
            </div>

            {loading ? (
              <p className="text-gray-300">Chargement des transactions...</p>
            ) : errorMessage ? (
              <p className="text-red-600">{`Erreur : ${errorMessage}`}</p>
            ) : isAdmin || isStaff ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                  <thead>
                    <tr>
                      {[
                        "#",
                        "Client",
                        "Voiture",
                        "Prix P.J",
                        "Emprunt/Retour",
                        "Total",
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
                          {transaction.customerName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          <div className="flex flex-col gap-2">
                            <span>{transaction.carName}</span>
                            <div className="w-[70%] h-[1px] bg-gray-200"></div>
                            <span>{transaction.returnDate}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {transaction.perDayPrice}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          <div className="flex flex-col gap-2">
                            <span>{transaction.borrowDate}</span>
                            <div className="w-[70%] h-[1px] bg-gray-200"></div>
                            <span>{transaction.returnDate}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {transaction.totalPrice}
                        </td>
                        <td>
                          <Link href={`/receipts/${transaction._id}/print`}>
                            <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 focus:outline-none focus:ring focus:ring-indigo-300">
                              Imprimer le Reçu
                            </button>
                          </Link>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
                <div className="flex justify-between items-center mt-4 flex-wrap gap-4">
                  <p className="text-gray-300">
                    Affichage de {startIndex + 1} à{" "}
                    {Math.min(startIndex + entriesPerPage, filteredData.length)}{" "}
                    sur {filteredData.length} entrées
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={handlePrevPage}
                      disabled={currentPage === 1}
                      className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Précédent
                    </button>
                    <button
                      onClick={handleNextPage}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Suivant
                    </button>
                  </div>
                </div>
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

export default ReceiptComp;
