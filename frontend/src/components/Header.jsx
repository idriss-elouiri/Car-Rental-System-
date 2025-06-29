"use client";

import Link from "next/link";
import React from "react";
import { useSelector } from "react-redux";

const Header = ({ title }) => {
  const { currentUser } = useSelector((state) => state.user);
  const isAdmin = currentUser?.isAdmin;
  const isStaff = currentUser?.isStaff;
  return (
    <header className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg border-b border-gray-700 flex  py-4 px-4 sm:px-6 lg:px-8 items-center justify-between ">
      <div className="max-w-7xl">
        <h1 className="text-2xl font-semibold text-gray-100">{title}</h1>
      </div>
      <Link href={"/profile"} className="flex items-center space-x-4">
        <span className="text-gray-700">Profile</span>
        {isAdmin && (
          <img
            src={currentUser.profilePicture}
            alt="profile"
            className="w-8 h-8 rounded-full"
          />
        )}
        {isStaff && (
          <img
            src={currentUser.profilePictureStaff}
            alt="profile"
            className="w-8 h-8 rounded-full"
          />
        )}
      </Link>
    </header>
  );
};
export default Header;
