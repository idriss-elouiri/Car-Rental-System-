import { FaCar, FaUser, FaMale, FaFemale } from "react-icons/fa";
import { MdOutlineEventAvailable } from "react-icons/md";

const MainSection = ({ latestCars, latestCustomers }) => {
  return (
    <section className="my-10 grid gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
      {/* Dernières Voitures Section */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-md flex-1">
        <h2 className="text-xl font-semibold mb-4">Dernières Voitures</h2>
        <ul className="space-y-4">
          {latestCars.map((car) => (
            <li
              key={car._id}
              className="flex items-center justify-between p-4 bg-gray-700 rounded-md shadow-sm"
            >
              <div className="flex items-center gap-4">
                <FaCar
                  className="text-2xl text-gray-600"
                  style={{ color: "#6366F1" }}
                />
                <div>
                  <p className="text-lg font-medium">{car.name}</p>
                  <span
                    className={`${
                      car.carStatus ? "text-green-600" : "text-red-500"
                    } text-sm flex items-center gap-1`}
                  >
                    <MdOutlineEventAvailable />
                    {car.carStatus === "Available"
                      ? "Disponible"
                      : "Indisponible"}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Derniers Clients Section */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-md flex-1">
        <h2 className="text-xl font-semibold mb-4">Derniers Clients</h2>
        <ul className="space-y-4">
          {latestCustomers.map((customer) => (
            <li
              key={customer._id}
              className="flex items-center justify-between p-4 bg-gray-700 rounded-md shadow-sm"
            >
              <div className="flex items-center gap-4">
                <FaUser className="text-2xl" style={{ color: "#6366F1" }} />
                <div>
                  <p className="text-lg font-medium">{customer.fullName}</p>
                  <span
                    className={`flex items-center gap-1 text-sm ${
                      customer.gender === "Male"
                        ? "text-red-500"
                        : "text-blue-500"
                    }`}
                  >
                    {customer.gender === "Male" ? (
                      <>
                        <FaMale />
                        Homme
                      </>
                    ) : (
                      <>
                        <FaFemale />
                        Femme
                      </>
                    )}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default MainSection;
