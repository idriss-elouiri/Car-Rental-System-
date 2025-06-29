"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const PrintComp = () => {
  const { id } = useParams();
  const [editTransaction, setEditTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const getEditTransaction = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/transaction//${id}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(
            data.message || "Failed to fetch editTransaction data"
          );
        }

        setEditTransaction(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      getEditTransaction();
    }
  }, [id, apiUrl]);

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className="min-h-screen p-6 flex items-center justify-center bg-gray-900">
      <div className="lg:max-w-[60%] w-full bg-gray-800 shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold text-center text-indigo-600 mb-6">
          Reçu de Commande
        </h1>

        {loading && <p className="text-center text-gray-400">Chargement...</p>}

        {error && <p className="text-center text-red-500">{error}</p>}

        {editTransaction && (
          <>
            <div className="overflow-x-auto">
              <table className="w-full border">
                <thead>
                  <tr className="bg-gray-700">
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Client
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Voiture
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Amende P.J.
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Emprunt/Retour
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">
                      {editTransaction.customerName}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">
                      {editTransaction.carName}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">
                      {editTransaction.perDayPrice} €
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">
                      <div className="flex flex-col gap-2">
                        <span>{editTransaction.borrowDate}</span>
                        <div className="w-[70%] h-[1px] bg-gray-600"></div>
                        <span>{editTransaction.returnDate}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">
                      {editTransaction.totalPrice} €
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="flex justify-end mt-6">
              <button
                onClick={handlePrint}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 focus:outline-none focus:ring focus:ring-indigo-300"
              >
                Imprimer le Reçu
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PrintComp;
