"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import FormRegisterStaff from "./FormRegisterStaff";

const EditStaff = () => {
  const { id } = useParams();
  const [editStaff, setEditStaff] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (typeof window !== "undefined") {
      const fetchStaffDetails = async () => {
        try {
          const response = await fetch(`${apiUrl}/api/staff/${id}`);
          const data = await response.json();

          if (!response.ok) {
            throw new Error(
              data.message || "Impossible de récupérer les données du personnel"
            );
          }

          setEditStaff(data);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      if (id) {
        fetchStaffDetails();
      } else {
        setError("Aucun identifiant de personnel fourni.");
        setLoading(false);
      }
    }
  }, [id, apiUrl]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-700 text-lg">Chargement...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-600 text-lg">{`Erreur: ${error}`}</p>
      </div>
    );
  }

  return editStaff ? (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-4">
      <FormRegisterStaff {...editStaff} />
    </div>
  ) : (
    <div className="flex justify-center items-center h-screen">
      <p className="text-gray-700 text-lg">
        Aucune donnée de personnel disponible
      </p>
    </div>
  );
};

export default EditStaff;
