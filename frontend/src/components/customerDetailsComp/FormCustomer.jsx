"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../../firebase.js";
import Layout from "../Layout.jsx";
import { motion } from "framer-motion";

const FormCustomer = ({
  _id,
  fullName: existingFullName,
  address: existingAddress,
  gender: existingGender,
  customerImageCard: existingCustomerImageCard,
  mobile: existingMobile,
  idCard: existingIdCard,
}) => {
  const [formData, setFormData] = useState({
    fullName: existingFullName || "",
    address: existingAddress || "",
    gender: existingGender || "",
    customerImageCard: existingCustomerImageCard || "",
    mobile: existingMobile || "",
    idCard: existingIdCard || "",
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState();
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const maxSizeMB = 2; // Set max size to 2MB
      if (file.size > maxSizeMB * 1024 * 1024) {
        setImageFileUploadError(`File must be less than ${maxSizeMB}MB`);
        return;
      }
      setImageFile(file);
    }
  };

  const uploadImage = async () => {
    setImageFileUploadError(null);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + imageFile.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageFileUploadProgress(progress.toFixed(0));
      },
      (error) => {
        setImageFileUploadError(
          "Could not upload image (File must be less than 2MB)"
        );
        setImageFileUploadProgress(null);
        setImageFile(null);
        setImageFileUrl(null);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData((prev) => ({ ...prev, customerImageCard: downloadURL }));
          setImageFileUrl(downloadURL);
          setImageFileUploadProgress(null);
        });
      }
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const url = _id
      ? `${apiUrl}/api/customer/editCustomer/${_id}`
      : `${apiUrl}/api/customer/createCustomer`;

    const res = await fetch(url, {
      method: _id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    if (!res.ok) {
      setLoading(false);
      return;
    }

    setFormData({
      fullName: "",
      address: "",
      gender: "",
      customerImageCard: "",
      mobile: "",
      idCard: "",
    });
    router.push("/customerDetails");
  };

  return (
    <Layout>
      <motion.div
        className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-3 border border-gray-700 mb-8 min-h-screen mx-auto sm:max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center justify-center h-full bg-gray-900 rounded-lg">
          <div className="w-full p-5 bg-gray-800 shadow-lg rounded-lg">
            <h2 className="text-2xl font-bold text-center text-white">
              Détails du Client
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              {/* Nom complet */}
              <div>
                <label className="block text-sm font-medium text-white">
                  Nom Complet
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Entrez le nom complet"
                  className="p-2 bg-gray-700 text-white placeholder-gray-400 rounded-lg w-full mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Adresse */}
              <div>
                <label className="block text-sm font-medium text-white">
                  Adresse
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Entrez l'adresse"
                  className="p-2 bg-gray-700 text-white placeholder-gray-400 rounded-lg w-full mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Genre */}
              <div>
                <label className="block text-sm font-medium text-white">
                  Genre
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="p-2 bg-gray-700 text-gray-400 rounded-lg w-full mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Sélectionnez le genre</option>
                  <option value="Male">Homme</option>
                  <option value="Female">Femme</option>
                  <option value="Other">Autre</option>
                </select>
              </div>

              {/* Téléphone */}
              <div>
                <label className="block text-sm font-medium text-white">
                  Téléphone Mobile
                </label>
                <input
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  placeholder="Entrez le numéro de téléphone"
                  className="p-2 bg-gray-700 text-white placeholder-gray-400 rounded-lg w-full mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Numéro de Carte d'identité */}
              <div>
                <label className="block text-sm font-medium text-white">
                  Numéro de Carte d'Identité
                </label>
                <input
                  type="text"
                  name="idCard"
                  value={formData.idCard}
                  onChange={handleChange}
                  placeholder="Entrez le numéro de carte d'identité"
                  className="p-2 bg-gray-700 text-white placeholder-gray-400 rounded-lg w-full mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Téléchargement de l'image */}
              <div>
                <label className="block text-sm font-medium text-white">
                  Carte d'Identité (Image)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  id="productImage"
                  onChange={handleImageChange}
                  className="w-full mt-2"
                />
                <button
                  type="button"
                  onClick={uploadImage}
                  disabled={imageFileUploadProgress !== null}
                  className="mt-2 p-2 bg-green-600 text-white rounded w-full"
                >
                  {imageFileUploadProgress
                    ? "Téléchargement..."
                    : "Télécharger l'image"}
                </button>
              </div>
              {formData.customerImageCard && (
                <img
                  src={formData.customerImageCard}
                  alt="Aperçu"
                  className="w-20 h-20 mt-2 mx-auto rounded-lg"
                />
              )}
              {imageFileUploadError && (
                <p className="text-red-500">{imageFileUploadError}</p>
              )}

              {/* Bouton Sauvegarder */}
              <button
                type="submit"
                disabled={loading}
                className="w-full px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                {loading ? "Publication..." : "Publier"}
              </button>
            </form>
          </div>
        </div>
      </motion.div>
    </Layout>
  );
};

export default FormCustomer;
