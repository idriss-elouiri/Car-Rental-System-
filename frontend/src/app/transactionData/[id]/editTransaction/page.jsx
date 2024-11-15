import React from "react";
import EditTransactionComp from "@/components/transactionDataComp/EditTransactionComp";

const EditTransaction = ({ params }) => {
  const { id } = params;
  return <EditTransactionComp id={id} />;
};

export default EditTransaction;
