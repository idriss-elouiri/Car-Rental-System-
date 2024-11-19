import dynamic from "next/dynamic";
const StaffComp = dynamic(() => import("@/components/staff/StaffComp"));

export default function Staff() {
  return <StaffComp />;
}
