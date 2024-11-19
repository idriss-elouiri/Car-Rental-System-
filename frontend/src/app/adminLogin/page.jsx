import dynamic from "next/dynamic";
const AdminLoginComp = dynamic(() =>
  import("@/components/adminLogin/AdminLoginComp")
);

export default function Adminlogin() {
  return (
    <>
      <AdminLoginComp />
    </>
  );
}
