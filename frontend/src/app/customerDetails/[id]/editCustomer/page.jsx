import dynamic from "next/dynamic";
const EditCustomerComp = dynamic(() =>
  import("@/components/customerDetailsComp/EditCustomerComp")
);

const EditCustomer = ({ params }) => {
  const { id } = params;

  return <EditCustomerComp id={id} />;
};

export default EditCustomer;
