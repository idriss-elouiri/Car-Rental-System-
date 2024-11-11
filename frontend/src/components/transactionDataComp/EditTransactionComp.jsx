"use client";

import React, { useEffect, useState } from "react";
import FormTransaction from "./FormTransaction";

const EditTransactionComp = ({id}) => {
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

  return editTransaction ? (
    <FormTransaction {...editTransaction} />
  ) : (
    <p className="text-center">No editTransaction data available</p>
  );
};

export default EditTransactionComp;
