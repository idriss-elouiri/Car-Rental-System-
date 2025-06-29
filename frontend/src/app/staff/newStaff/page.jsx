import dynamic from "next/dynamic";
const FormRegisterStaff = dynamic(() =>
  import("@/components/staff/FormRegisterStaff")
);

export default function newStaff() {
  return <FormRegisterStaff />;
}
