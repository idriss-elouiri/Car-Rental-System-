import dynamic from "next/dynamic";
const DashboardComp = dynamic(() =>
  import("@/components/dashboard/DashboardComp")
);

const Dashboard = () => {
  return <DashboardComp />;
};

export default Dashboard;
