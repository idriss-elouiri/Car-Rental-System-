"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../../redux/user/userSlice";

export default function StaffLoginComp() {
  const [formData, setFormData] = useState({
    emailStaff: "",
    passwordStaff: "",
  });
  const { loading, error: errorMessage } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const router = useRouter();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(signInStart());
    try {
      const res = await fetch(`${apiUrl}/api/staff/loginStaff`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok || data.success === false) {
        dispatch(signInFailure(data.message));
        throw new Error(
          data.message || "Échec de la connexion. Veuillez réessayer."
        );
      }

      dispatch(signInSuccess(data));
      router.push("/dashboard");
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Connexion
        </h2>
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          {/* Email Field */}
          <div>
            <label
              htmlFor="emailStaff"
              className="block text-sm font-medium text-gray-700"
            >
              Adresse Email
            </label>
            <input
              type="email"
              id="emailStaff"
              name="emailStaff"
              value={formData.emailStaff}
              onChange={handleInputChange}
              className="w-full p-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Entrez votre adresse email"
            />
          </div>

          {/* Password Field */}
          <div>
            <label
              htmlFor="passwordStaff"
              className="block text-sm font-medium text-gray-700"
            >
              Mot de Passe
            </label>
            <input
              type="password"
              id="passwordStaff"
              name="passwordStaff"
              value={formData.passwordStaff}
              onChange={handleInputChange}
              className="w-full p-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Entrez votre mot de passe"
            />
          </div>

          {/* Register Link */}
          <p className="text-sm text-center text-gray-500">
            Vous n'avez pas de compte ?{" "}
            <Link
              href="/adminRegister"
              className="text-indigo-600 hover:underline"
            >
              Inscrivez-vous ici
            </Link>
          </p>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className={`w-full px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                loading && "opacity-50 cursor-not-allowed"
              }`}
              disabled={loading}
            >
              {loading ? "Chargement..." : "Connexion"}
            </button>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <p
              className="mt-2 text-sm text-center text-red-600"
              id="error-message"
            >
              {errorMessage}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
