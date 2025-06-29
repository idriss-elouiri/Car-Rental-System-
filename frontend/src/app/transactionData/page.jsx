import dynamic from "next/dynamic";
const TransactionDataComp = dynamic(() =>
  import("@/components/transactionDataComp/TransactionDataComp")
);

const TransactionData = () => {
  return <TransactionDataComp />;
};

export default TransactionData;
