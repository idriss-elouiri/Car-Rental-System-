"use client"; // Always at the top

import React, { useEffect, useState } from "react";
import FormCustomer from "./FormCustomer";
import { useParams } from "next/navigation";

const EditCustomerComp = () => {
  const { id } = useParams();
  const [editCustomer, setEditCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchEditCustomer = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/customer/${id}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(
            data.message || "Impossible de récupérer les données du client"
          );
        }

        setEditCustomer(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchEditCustomer();
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

  return editCustomer ? (
    <FormCustomer {...editCustomer} />
  ) : (
    <p className="text-center text-gray-700 font-medium text-lg mt-6">
      Aucune donnée de client à modifier n'est disponible.
    </p>
  );
};

export default EditCustomerComp;
