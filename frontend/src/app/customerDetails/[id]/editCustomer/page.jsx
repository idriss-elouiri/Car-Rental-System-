import EditCustomerComp from "@/components/customerDetailsComp/EditCustomerComp";
import React from "react";

const EditCustomer = ({ params }) => {
  const { id } = params;

  return (
    <>
      <EditCustomerComp id={id}/>
    </>
  );
};

export default EditCustomer;
