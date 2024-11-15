import React from "react";
import EditCustomerComp from "@/components/customerDetailsComp/EditCustomerComp";

const EditCustomer = ({ params }) => {
  const { id } = params;

  return <EditCustomerComp id={id} />;
};

export default EditCustomer;
