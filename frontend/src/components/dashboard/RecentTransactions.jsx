"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaSearch } from "react-icons/fa";

const TransactionsRécentes = ({ transactions }) => {
  const [termeRecherche, setTermeRecherche] = useState("");
  const [entréesParPage, setEntréesParPage] = useState(10);
  const [pageCourante, setPageCourante] = useState(1);

  // Filtrer les données en fonction du terme de recherche
  const donnéesFiltrées = transactions?.filter((transaction) =>
    transaction.customerName
      .toLowerCase()
      .includes(termeRecherche.toLowerCase())
  );

  // Calculs de la pagination
  const pagesTotales = Math.ceil(donnéesFiltrées.length / entréesParPage);
  const indexDébut = (pageCourante - 1) * entréesParPage;
  const donnéesCourantes = donnéesFiltrées.slice(
    indexDébut,
    indexDébut + entréesParPage
  );

  // Fonctions gestionnaires
  const handleSearchChange = (e) => setTermeRecherche(e.target.value);
  const handleEntriesChange = (e) => setEntréesParPage(Number(e.target.value));
  const handleNextPage = () =>
    setPageCourante((prev) => Math.min(prev + 1, pagesTotales));
  const handlePrevPage = () => setPageCourante((prev) => Math.max(prev - 1, 1));

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        <motion.div
          className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex justify-between items-center mb-6">
            <div className="relative w-full md:w-1/3">
              <input
                type="text"
                placeholder="Rechercher des transactions..."
                className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={handleSearchChange}
                value={termeRecherche}
              />
              <FaSearch
                className="absolute left-3 top-2.5 text-gray-400"
                size={18}
              />
            </div>
            <select
              value={entréesParPage}
              onChange={handleEntriesChange}
              className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {[10, 20, 30].map((value) => (
                <option key={value} value={value}>
                  Afficher {value} entrées
                </option>
              ))}
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Voiture
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Retour
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Statut
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-700">
                {donnéesCourantes.map((transaction, index) => (
                  <motion.tr
                    key={transaction._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {indexDébut + index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {transaction.customerName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {transaction.carName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {transaction.borrowDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {transaction.dateOfReturn}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {transaction.totalPrice}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {transaction.isCompleted ? (
                        <button className="p-2 bg-green-600 rounded-lg">
                          Terminé
                        </button>
                      ) : (
                        <button className="p-2 bg-red-600 rounded-lg">
                          Non Terminé
                        </button>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-between items-center mt-4">
              <p>
                Affichage de {indexDébut + 1} à{" "}
                {Math.min(indexDébut + entréesParPage, donnéesFiltrées.length)}{" "}
                sur {donnéesFiltrées.length} entrées
              </p>
              <div className="flex gap-2">
                <button
                  onClick={handlePrevPage}
                  disabled={pageCourante === 1}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                >
                  Précédent
                </button>
                <button
                  onClick={handleNextPage}
                  disabled={pageCourante === pagesTotales}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                >
                  Suivant
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default TransactionsRécentes;
