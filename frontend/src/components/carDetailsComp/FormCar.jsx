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

const FormCar = ({
  _id,
  name: existingName,
  carNumber: existingCarNumber,
  color: existingColor,
  carImage: existingCarImage,
  vehicleYear: existingVehicleYear,
  carStatus: existingCarStatus,
}) => {
  const [formData, setFormData] = useState({
    name: existingName || "",
    carNumber: existingCarNumber || "",
    color: existingColor || "",
    carImage: existingCarImage || "",
    vehicleYear: existingVehicleYear || "",
    carStatus: existingCarStatus || "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

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
          setFormData((prev) => ({ ...prev, carImage: downloadURL }));
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
      ? `${apiUrl}/api/car/editCar/${_id}`
      : `${apiUrl}/api/car/createCar`;

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
      name: "",
      carNumber: "",
      color: "",
      vehicleYear: "",
      customerImageCard: "",
      carStatus: "",
    });
    router.push("/carDetails");
  };
  return (
    <Layout>
      <motion.div
        className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8 min-h-screen mx-auto max-w-4xl"
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center justify-center h-full bg-gray-900">
          <div className="w-full max-w-lg p-5 bg-gray-800 shadow-lg rounded-lg">
            <h2 className="text-2xl font-bold text-center text-white">
              Détails de la voiture
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4 mt-3">
              {/* Nom complet */}
              <div>
                <label className="block text-sm font-medium text-white">
                  Nom complet
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Entrez votre nom complet"
                  className="p-2 bg-gray-700 text-white placeholder-gray-400 rounded-lg w-full mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Numéro de voiture */}
              <div>
                <label className="block text-sm font-medium text-white">
                  Numéro de voiture
                </label>
                <input
                  type="text"
                  name="carNumber"
                  value={formData.carNumber}
                  onChange={handleChange}
                  placeholder="Entrez le numéro de la voiture"
                  className="p-2 bg-gray-700 text-white placeholder-gray-400 rounded-lg w-full mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Couleur */}
              <div>
                <label className="block text-sm font-medium text-white">
                  Couleur
                </label>
                <input
                  type="text"
                  name="color"
                  value={formData.color}
                  onChange={handleChange}
                  placeholder="Entrez la couleur"
                  className="p-2 bg-gray-700 text-white placeholder-gray-400 rounded-lg w-full mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Année du véhicule */}
              <div>
                <label className="block text-sm font-medium text-white">
                  Année du véhicule
                </label>
                <input
                  type="text"
                  name="vehicleYear"
                  value={formData.vehicleYear}
                  onChange={handleChange}
                  placeholder="Entrez l'année du véhicule"
                  className="p-2 bg-gray-700 text-white placeholder-gray-400 rounded-lg w-full mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Téléchargement d'image */}
              <div className="flex flex-col md:flex-row gap-4 items-center">
                <input
                  type="file"
                  name="customerImageCard"
                  accept="image/*"
                  id="customerImageCard"
                  onChange={handleImageChange}
                  className="w-full md:w-auto"
                />
                <button
                  type="button"
                  onClick={uploadImage}
                  disabled={imageFileUploadProgress !== null}
                  className="p-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  {imageFileUploadProgress
                    ? "Téléchargement..."
                    : "Télécharger l'image"}
                </button>
              </div>
              {formData.carImage && (
                <img
                  src={formData.carImage}
                  alt="Aperçu"
                  className="w-20 h-20 mt-2 rounded-lg object-cover"
                />
              )}
              {imageFileUploadError && (
                <p className="text-red-500">{imageFileUploadError}</p>
              )}

              {/* Statut de la voiture */}
              <div>
                <label className="block text-sm font-medium text-white">
                  Statut de la voiture
                </label>
                <select
                  name="carStatus"
                  value={formData.carStatus}
                  onChange={handleChange}
                  className="p-2 bg-gray-700 text-gray-400 placeholder-gray-400 rounded-lg w-full mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Sélectionnez le statut</option>
                  <option value="Available">Disponible</option>
                  <option value="Not Available">Non Disponible</option>
                </select>
              </div>

              {/* Bouton enregistrer */}
              <button
                type="submit"
                onClick={() => router.push("/carDetails")}
                disabled={loading}
                className="w-full px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                {loading ? "Publication en cours..." : "Publier"}
              </button>
            </form>
          </div>
        </div>
      </motion.div>
    </Layout>
  );
};

export default FormCar;
