"use client"; // Always at the top

import React, { useEffect, useState } from "react";
import FormCar from "./FormCar"; // Assuming this is your car form component
import { useParams } from "next/navigation";

const EditCarComp = () => {
  const { id } = useParams();
  const [editCar, setEditCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchEditCar = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/car/${id}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(
            data.message || "Impossible de récupérer les données de la voiture"
          );
        }

        setEditCar(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchEditCar();
    }
  }, [id, apiUrl]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full py-10">
        <p className="text-gray-600 font-medium text-lg">
          Chargement en cours...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 p-6 text-center">
        <p className="text-red-500 font-semibold text-lg">Erreur : {error}</p>
        <button
          onClick={() => setError(null)}
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-800 transition duration-300"
        >
          Réessayer
        </button>
      </div>
    );
  }

  return editCar ? (
    <FormCar {...editCar} />
  ) : (
    <div className="flex items-center justify-center h-full py-10">
      <p className="text-gray-700 font-medium text-lg">
        Aucune donnée de voiture disponible.
      </p>
    </div>
  );
};

export default EditCarComp;
