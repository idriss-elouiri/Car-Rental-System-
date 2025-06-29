import dynamic from "next/dynamic";
const PrintComp = dynamic(() => import("@/components/receipts/PrintComp"));

export default function Print() {
  return <PrintComp />;
}
