import dynamic from "next/dynamic";
const CarDetailsComp = dynamic(() =>
  import("@/components/carDetailsComp/CarDetailsComp")
);

const CarDetails = () => {
  return <CarDetailsComp />;
};

export default CarDetails;
