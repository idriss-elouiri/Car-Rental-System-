import dynamic from "next/dynamic";
const ReceiptComp = dynamic(() => import("@/components/receipts/ReceiptsComp"));

export default function receiptsPage() {
  return <ReceiptComp />;
}
