import dynamic from "next/dynamic";
const EditStaff = dynamic(() => import("@/components/staff/EditStaffComp"));

export default function editStaff() {
  return <EditStaff />;
}
