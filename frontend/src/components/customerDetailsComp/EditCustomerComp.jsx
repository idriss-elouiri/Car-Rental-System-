"use client"; // Move this to the very top

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import FormCustomer from "./FormCustomer";

const EditCustomerComp = () => {
  const { id } = useParams();

  const [editCustomer, setEditCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const getEditCustomer = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/customer/${id}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch editCustomer data");
        }

        setEditCustomer(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      getEditCustomer();
    }
  }, [id, apiUrl]);

  if (loading) return <p className="text-center">Loading...</p>;
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

  return editCustomer ? (
    <FormCustomer {...editCustomer} />
  ) : (
    <p className="text-center">No editCustomer data available</p>
  );
};

export default EditCustomerComp;
