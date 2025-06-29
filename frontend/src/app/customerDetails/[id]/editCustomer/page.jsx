import dynamic from "next/dynamic";
const EditCustomerComp = dynamic(() =>
  import("@/components/customerDetailsComp/EditCustomerComp")
);

const EditCustomer = () => {
  return <EditCustomerComp  />;
};

export default EditCustomer;
