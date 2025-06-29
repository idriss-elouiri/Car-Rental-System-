import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from "recharts";

// Définir les couleurs des barres du graphique
const COLORS = ["#6366F1", "#10B981"];

const SalesChannelChart = ({ carsData }) => {
  // Filtrer et trier les voitures en fonction du nombre de locations (les plus louées en premier)
  const mostRentedCars = carsData
    .filter((car) => car.carStatus === "Available") // Filtrer les voitures disponibles
    .sort((a, b) => b.rentalCount - a.rentalCount); // Trier par nombre de locations (décroissant)

  // Formater les données pour le graphique
  const chartData = mostRentedCars.map((car) => ({
    name: `${car.name} (${car.rentalCount})`, // Afficher le nom de la voiture avec le nombre de locations
    value: car.rentalCount,
  }));

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 lg:col-span-2 border border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <h2 className="text-lg font-medium mb-4 text-gray-100">
        Voitures les Plus Louées
      </h2>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
            <XAxis dataKey="name" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(31, 41, 55, 0.8)",
                borderColor: "#4B5563",
              }}
              itemStyle={{ color: "#E5E7EB" }}
            />
            <Legend />
            <Bar dataKey="value" fill="#8884d8">
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default SalesChannelChart;
