import dynamic from "next/dynamic";
const FormCustomer = dynamic(() =>
  import("@/components/customerDetailsComp/FormCustomer")
);

const NewCustomer = () => {
  return <FormCustomer />;
};

export default NewCustomer;
