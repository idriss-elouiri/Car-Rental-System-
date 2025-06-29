import dynamic from "next/dynamic";
const FormTransaction = dynamic(() =>
  import("@/components/transactionDataComp/FormTransaction")
);

const newTransaction = () => {
  return <FormTransaction />;
};

export default newTransaction;
