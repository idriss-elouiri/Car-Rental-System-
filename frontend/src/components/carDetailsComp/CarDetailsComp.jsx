"use client";

import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { FaCar, FaEdit, FaSearch, FaTrash } from "react-icons/fa";
import { motion } from "framer-motion";
import Link from "next/link";
import Header from "../Header";
import Layout from "../Layout";
import { useSelector } from "react-redux";

const CarDetailsComp = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [cars, setCars] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [carIdToDelete, setCarIdToDelete] = useState("");
  const [loading, setLoading] = useState(true); // Loading state
  const isAdmin = currentUser?.isAdmin;
  const isStaff = currentUser?.isStaff;
  const router = useRouter();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
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
          setErrorMessage(data.message || "Failed to fetch transactions.");
          console.error(data.message);
        }
      } catch (error) {
        console.error("Error fetching cars:", error);
        setErrorMessage(error.message);
      } finally {
        setLoading(false); // Stop loading
      }
    };
    fetchCars();
  }, [apiUrl]);

  const handleDeleteCar = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/car/deleteCar/${carIdToDelete}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setCars((prev) => prev.filter((car) => car._id !== carIdToDelete));
        setShowModal(false);
      } else {
        const data = await res.json();
        console.error(data.message);
      }
    } catch (error) {
      console.error("Error deleting car:", error);
    }
  };

  // Filter data based on the search term
  const filteredData = cars?.filter(
    (car) =>
      car.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.carNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.vehicleYear.toLowerCase().includes(searchTerm.toLowerCase())
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

  return (
    <Layout>
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Section Voitures" />
  
      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        <motion.div
          className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex justify-between items-center w-full mb-2">
            <h2 className="text-xl font-semibold text-gray-100">
              Détails de la voiture de location
            </h2>
  
            <Link
              href="/carDetails/newCar"
              className="mb-4 inline-flex items-center px-4 py-2 border border-green-500 text-green-500 rounded-md hover:bg-green-500 hover:text-white"
            >
              + Ajouter une nouvelle voiture
            </Link>
          </div>
          <div className="flex justify-between items-center mb-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Rechercher des voitures..."
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
              className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {[10, 20, 30].map((value) => (
                <option key={value} value={value}>
                  Afficher {value} entrées
                </option>
              ))}
            </select>
          </div>
          {loading ? (
            <p>Chargement des voitures...</p>
          ) : errorMessage ? (
            <p className="text-red-600">{errorMessage}</p>
          ) : isAdmin || isStaff ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      #
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Image de la voiture
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Nom
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Numéro
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Couleur
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Année de production
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-4 py-2 text-center">Actions</th>
                  </tr>
                </thead>
  
                <tbody className="divide-y divide-gray-700">
                  {currentData.map((car, index) => (
                    <motion.tr
                      key={car._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {startIndex + index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        <img className="w-30 h-20 rounded" src={car.carImage} alt={car.name} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {car.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {car.carNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {car.color}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {car.vehicleYear}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {car.carStatus}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        <>
                          <button
                            className="text-indigo-400 hover:text-indigo-300 mr-2"
                            onClick={() =>
                              router.push(`/carDetails/${car._id}/editCar`)
                            }
                          >
                            <FaEdit size={18} />
                          </button>
                          <button
                            className="text-red-400 hover:text-red-300"
                            onClick={() => {
                              setShowModal(true);
                              setCarIdToDelete(car._id);
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
                  Affichage de {startIndex + 1} à{" "}
                  {Math.min(startIndex + entriesPerPage, filteredData.length)}{" "}
                  sur {filteredData.length} entrées
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                  >
                    Précédent
                  </button>
                  <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
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
                      Êtes-vous sûr de vouloir supprimer cette voiture ?
                    </h3>
                    <div className="mt-6 flex justify-center gap-4">
                      <button
                        onClick={() => handleDeleteCar(carIdToDelete)}
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
              )}
            </div>
          ) : (
            <p className="text-gray-500 text-center mt-4">
              Vous n'avez pas encore de voitures !
            </p>
          )}
        </motion.div>
      </main>
    </div>
  </Layout>
  
  );
};

export default CarDetailsComp;
