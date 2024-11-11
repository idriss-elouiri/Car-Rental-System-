import EditTransactionComp from "@/components/transactionDataComp/EditTransactionComp";
import React from "react";

const EditTransaction = ({ params }) => {
  const { id } = params;
  return (
    <>
      <EditTransactionComp id={id} />
    </>
  );
};

export default EditTransaction;
