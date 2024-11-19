import dynamic from "next/dynamic";
const ProfileComp = dynamic(() => import("@/components/profileComp/page"));

export default function Profile() {
  return <ProfileComp />;
}
