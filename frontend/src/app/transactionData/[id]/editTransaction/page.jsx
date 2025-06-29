import dynamic from "next/dynamic";
const EditTransactionComp = dynamic(() =>
  import("@/components/transactionDataComp/EditTransactionComp")
);

const EditTransaction = ({ params }) => {
  const { id } = params;
  return <EditTransactionComp id={id} />;
};

export default EditTransaction;
