import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";

const SalesOverview = () => {
  const [salesData, setSalesData] = useState([]);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/transaction/sales-overview`);
        const data = await response.json();
        
        // Transform data to include name, sales, and date
        const formattedData = data.monthlyOverview.map(item => ({
          name: item.monthName, // e.g., "November"
          sales: item.totalRevenue, // total revenue for the month
          date: item.date // formatted date, e.g., "11/8/2024"
        }));
        
        setSalesData(formattedData);
      } catch (error) {
        console.error("Error fetching sales data:", error);
      }
    };

    fetchSalesData();
  }, [apiUrl]);

  // Custom tooltip to display monthName, totalRevenue, and date
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const { name, sales, date } = payload[0].payload;
      return (
        <div className="bg-gray-700 p-2 rounded shadow-lg">
          <p className="text-gray-300">{name}</p>
          <p className="text-gray-200">Revenue: ${sales.toLocaleString()}</p>
          <p className="text-gray-400">Date: {date}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <h2 className="text-lg font-medium mb-4 text-gray-100">Sales Overview</h2>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={salesData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
            <XAxis dataKey="name" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="sales"
              stroke="#6366F1"
              strokeWidth={3}
              dot={{ fill: "#6366F1", strokeWidth: 2, r: 6 }}
              activeDot={{ r: 8, strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default SalesOverview;
