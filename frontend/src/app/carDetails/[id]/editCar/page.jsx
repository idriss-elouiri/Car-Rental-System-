import React from "react";
import EditCarComp from "@/components/carDetailsComp/EditCarComp";

const EditCar = ({ params }) => {
  const { id } = params;
  return (
    <>
      <EditCarComp id={id} />
    </>
  );
};

export default EditCar;
