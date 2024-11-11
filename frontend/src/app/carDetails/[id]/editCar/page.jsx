import EditCarComp from "@/components/carDetailsComp/EditCarComp";
import React from "react";

const EditCar = ({ params }) => {
  const { id } = params;
  return (
    <>
      <EditCarComp id={id} />
    </>
  );
};

export default EditCar;
