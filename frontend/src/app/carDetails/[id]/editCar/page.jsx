import dynamic from "next/dynamic";
const EditCarComp = dynamic(() =>
  import("@/components/carDetailsComp/EditCarComp")
);

const EditCar = () => {
  return <EditCarComp />;
};

export default EditCar;
