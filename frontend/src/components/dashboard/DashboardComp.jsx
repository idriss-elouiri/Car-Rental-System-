"use client";

import React, { useEffect, useState } from "react";
import RecentTransactions from "./RecentTransactions";
import HeroSection from "./HeroSection";
import MainSection from "./MainSection";
import { motion } from "framer-motion";
import Header from "../Header";
import SalesOverview from "./SalesOverviewChart";
import SalesChannelChart from "./SalesChannelChart";

const DashboardComp = () => {
  const [totals, setTotals] = useState({
    availableCars: 0,
    totalCars: 0,
    customers: 0,
    completedRentals: 0,
    transactions: 0,
  });
  const [transactions, setTransactions] = useState([]);
  const [carData, setCarData] = useState([]);
  const [latestCars, setLatestCars] = useState([]);
  const [latestCustomers, setLatestCustomers] = useState([]);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [customersRes, carsRes, transactionsRes] = await Promise.all([
          fetch(`${apiUrl}/api/customer/getCustomers`, {
            method: "GET",
            credentials: "include",
          }),
          fetch(`${apiUrl}/api/car/getCars`, {
            method: "GET",
            credentials: "include",
          }),
          fetch(`${apiUrl}/api/transaction/getTransactions`, {
            method: "GET",
            credentials: "include",
          }),
        ]);

        const customersData = await customersRes.json();
        const carsData = await carsRes.json();
        const transactionsData = await transactionsRes.json();

        if (customersRes.ok) {
          setTotals((prev) => ({
            ...prev,
            customers: customersData.totalCustomers,
          }));
          setLatestCustomers(customersData.customers.slice(-3));
        }
        if (carsRes.ok) {
          setTotals((prev) => ({
            ...prev,
            availableCars: carsData.availableCars,
            totalCars: carsData.totalCars,
          }));
          setCarData(carsData.cars)
          setLatestCars(carsData.cars.slice(-3));
        }
        if (transactionsRes.ok) {
          setTransactions(transactionsData.transactions);

          // Calculate the total sales
          const totalSales = transactionsData.transactions.reduce(
            (acc, transaction) =>
              acc + transaction.totalPrice + transaction.totalPenalty,
            0
          );

          // Count completed rentals
          const completedRentalsCount = transactionsData.transactions.filter(
            (transaction) => transaction.isCompleted
          ).length;

          setTotals((prev) => ({
            ...prev,
            transactions: totalSales,
            completedRentals: completedRentalsCount,
          }));
        }
      } catch (error) {
        console.log("Error fetching data: ", error.message);
      }
    };

    fetchData();
  }, []);
  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Overview" />

      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        {/* STATS */}
        <motion.div
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          {" "}
          <HeroSection
            totalCustomers={totals.customers}
            totalCars={totals.totalCars}
            availableCars={totals.availableCars}
            completedRentals={totals.completedRentals}
            transactions={totals.transactions}
          />
        </motion.div>
        <MainSection
          latestCars={latestCars}
          latestCustomers={latestCustomers}
        />
        {/* CHARTS */}
        <div className="grid grid-cols-1  gap-8">
          <SalesOverview />
          <SalesChannelChart carsData={carData} />
        </div>
        <RecentTransactions transactions={transactions} />
      </main>
    </div>
  );
};

export default DashboardComp;
