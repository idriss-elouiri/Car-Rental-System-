import dynamic from "next/dynamic";
const CustomerDetailsComp = dynamic(() =>
  import("@/components/customerDetailsComp/CustomerDetailsComp")
);

const CustomerDetails = () => {
  return <CustomerDetailsComp />;
};

export default CustomerDetails;
