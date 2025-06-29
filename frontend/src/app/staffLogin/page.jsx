import dynamic from "next/dynamic";
const StaffLoginComp = dynamic(() => import("@/components/staffLogin/page"));

export default function Stafflogin() {
  return (
    <>
      <StaffLoginComp />
    </>
  );
}
