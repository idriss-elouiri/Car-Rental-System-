"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import FormCar from "./FormCar";

const EditCarComp = () => {
  const { id } = useParams();
  const [editCar, setEditCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const getEditCar = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/car/${id}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch editCar data");
        }

        setEditCar(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      getEditCar();
    }
  }, [id, apiUrl]);

  if (loading) return <p className="text-center">Loading...</p>; // Consider adding a spinner here
  if (error)
    return (
      <div className="text-red-500 text-center">
        <p>Error: {error}</p>
        <button
          onClick={() => setError(null)}
          className="bg-indigo-600 text-white px-4 py-2 rounded"
        >
          Retry
        </button>
      </div>
    );

  return editCar ? (
    <FormCar {...editCar} />
  ) : (
    <p className="text-center">No editCar data available</p>
  );
};

export default EditCarComp;
