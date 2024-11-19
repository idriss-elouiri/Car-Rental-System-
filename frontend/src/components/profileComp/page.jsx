"use client";

import Layout from "@/components/Layout";
import React from "react";
import { useSelector } from "react-redux";
import ProfileAdminComp from "../profileAdmin/ProfileAdminComp";

const ProfileComp = () => {
  const { currentUser } = useSelector((state) => state.user);
  const isAdmin = currentUser?.isAdmin;
  const isStaff = currentUser?.isStaff;

  return (
    <Layout>
      {isAdmin && <ProfileAdminComp />}
      {isStaff && !isAdmin && <ProfileStaff />}{" "}
    </Layout>
  );
};

export default ProfileComp;
