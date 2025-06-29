import dynamic from "next/dynamic";
const FormCar = dynamic(() => import("@/components/carDetailsComp/FormCar"));

const NewCar = () => {
  return <FormCar />;
};

export default NewCar;
