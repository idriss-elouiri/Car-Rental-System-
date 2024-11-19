import dynamic from "next/dynamic";
const EditCarComp = dynamic(() =>
  import("@/components/carDetailsComp/EditCarComp")
);
const EditCar = ({ params }) => {
  const { id } = params;
  return (
    <>
      <EditCarComp id={id} />
    </>
  );
};

export default EditCar;
