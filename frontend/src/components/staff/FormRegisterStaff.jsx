"use client";
import { useEffect, useRef, useState } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../../firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useRouter } from "next/navigation";
import Layout from "../Layout.jsx";
import { motion } from "framer-motion";

const FormRegisterStaff = ({
  _id,
  nameStaff: existingName,
  emailStaff: existingEmail,
  numberStaff: existingNumber,
  passwordStaff: existingPassword,
  profilePictureStaff: existingProfilePictureStaff,
  isStaff: existingIsStaff,
}) => {
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [formData, setFormData] = useState({
    nameStaff: existingName || "",
    emailStaff: existingEmail || "",
    passwordStaff: existingPassword || "",
    profilePictureStaff:
      existingProfilePictureStaff ||
      "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
    numberStaff: existingNumber || `STF-${Date.now().toString().slice(-6)}`,
    isStaff: existingIsStaff || false,
  });
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [imageFileUploading, setImageFileUploading] = useState(false);
  const filePickerRef = useRef();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);

  const uploadImage = async () => {
    if (typeof window === "undefined") return; // Prevent SSR issues

    setImageFileUploading(true);
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
        setImageFileUploading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileUrl(downloadURL);
          setFormData({ ...formData, profilePictureStaff: downloadURL });
          setImageFileUploading(false);
        });
      }
    );
  };

  const handleInputChange = (e) => {
    const { id, value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: id === "isStaff" ? checked : value,
    }));
  };
  console.log(formData);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const url = _id
      ? `${apiUrl}/api/adminUser/adminUpdateStaff/${_id}`
      : `${apiUrl}/api/staff/registerStaff`;

    try {
      const res = await fetch(url, {
        method: _id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data.message || "An error occurred");
      } else {
        router.push("/staff");
      }
    } catch (error) {
      setErrorMessage("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <Layout>
      <motion.div
        className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8 min-h-screen sm:w-[90%] md:w-[70%] lg:w-[50%] mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="p-4 bg-gray-800 shadow-lg rounded-lg">
          <h2 className="text-2xl font-bold text-center text-white mb-6">
            Enregistrer un employé
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Image Upload */}
            <div className="flex justify-center">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                ref={filePickerRef}
                hidden
              />
              <div
                className="relative w-24 h-24 cursor-pointer shadow-md overflow-hidden rounded-full"
                onClick={() => filePickerRef.current.click()}
              >
                {imageFileUploadProgress && (
                  <CircularProgressbar
                    value={imageFileUploadProgress || 0}
                    text={`${imageFileUploadProgress}%`}
                    strokeWidth={5}
                    styles={{
                      root: {
                        width: "100%",
                        height: "100%",
                        position: "absolute",
                      },
                      path: {
                        stroke: `rgba(62, 152, 199, ${
                          imageFileUploadProgress / 100
                        })`,
                      },
                    }}
                  />
                )}
                <img
                  src={imageFileUrl || formData.profilePictureStaff}
                  alt="Employé"
                  className={`w-32 h-32 rounded-full w-full h-full object-cover border-4 border-gray-300 ${
                    imageFileUploadProgress &&
                    imageFileUploadProgress < 100 &&
                    "opacity-60"
                  }`}
                />
              </div>
            </div>
            {imageFileUploadError && (
              <p className="text-red-500 text-sm text-center mt-2">
                {imageFileUploadError}
              </p>
            )}

            {/* Staff Number */}
            <div>
              <label
                htmlFor="numberStaff"
                className="block text-sm font-medium text-white"
              >
                Numéro d'employé
              </label>
              <input
                type="text"
                id="numberStaff"
                value={formData.numberStaff}
                className="p-2 bg-gray-700 text-white placeholder-gray-400 rounded-lg w-full mt-2 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                readOnly
              />
            </div>

            {/* Name */}
            <div>
              <label
                htmlFor="nameStaff"
                className="block text-sm font-medium text-white"
              >
                Nom de l'employé <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="nameStaff"
                value={formData.nameStaff}
                onChange={handleInputChange}
                className="p-2 bg-gray-700 text-white placeholder-gray-400 rounded-lg w-full mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Entrez le nom"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="emailStaff"
                className="block text-sm font-medium text-white"
              >
                Email de l'employé <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="emailStaff"
                value={formData.emailStaff}
                onChange={handleInputChange}
                className="p-2 bg-gray-700 text-white placeholder-gray-400 rounded-lg w-full mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Entrez l'email"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="passwordStaff"
                className="block text-sm font-medium text-white"
              >
                Mot de passe <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                id="passwordStaff"
                onChange={handleInputChange}
                className="p-2 bg-gray-700 text-white placeholder-gray-400 rounded-lg w-full mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Entrez le mot de passe"
                required
              />
            </div>

            {/* Is Staff Checkbox */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isStaff"
                checked={formData.isStaff}
                onChange={handleInputChange}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-700 bg-gray-700 rounded"
              />
              <label htmlFor="isStaff" className="text-sm text-white">
                Est employé
              </label>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200"
                disabled={loading}
              >
                {loading ? "Envoi en cours..." : _id ? "Modifier" : "Ajouter"}
              </button>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <p className="mt-4 text-sm text-red-600 text-center">
                {errorMessage}
              </p>
            )}
          </form>
        </div>
      </motion.div>
    </Layout>
  );
};

export default FormRegisterStaff;
