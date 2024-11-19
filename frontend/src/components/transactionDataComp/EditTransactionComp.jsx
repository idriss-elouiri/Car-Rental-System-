"use client";

import React, { useEffect, useState } from "react";
import FormTransaction from "./FormTransaction";
import { useParams } from "next/navigation";

const EditTransactionComp = () => {
  const { id } = useParams();
  const [editTransaction, setEditTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchEditTransaction = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/transaction/${id}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(
            data.message ||
              "Impossible de récupérer les données de la transaction"
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
      fetchEditTransaction();
    }
  }, [id, apiUrl]);

  if (loading) {
    return (
      <p className="text-center text-gray-600 font-medium">
        Chargement en cours...
      </p>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center flex flex-col items-center space-y-4 p-4">
        <p className="text-lg font-semibold">Erreur : {error}</p>
        <button
          onClick={() => setError(null)}
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-800 transition duration-300"
        >
          Réessayer
        </button>
      </div>
    );
  }

  return editTransaction ? (
    <FormTransaction {...editTransaction} />
  ) : (
    <p className="text-center text-gray-700 font-medium text-lg mt-6">
      Aucune donnée de transaction à modifier n'est disponible.
    </p>
  );
};

export default EditTransactionComp;
