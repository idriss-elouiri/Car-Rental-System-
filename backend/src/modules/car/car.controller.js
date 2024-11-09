import Car from "./car.model.js";

export const createCar = async (req, res, next) => {
  const newCar = new Car({
    ...req.body,
  });

  try {
    const savedCar = await newCar.save();
    res.status(201).json(savedCar);
  } catch (error) {
    console.error("Error creating car:", error); // Log error for debugging
    next(error);
  }
};

export const getCars = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex, 10) || 0;

    const cars = await Car.find()
      .sort({ rentalCount: -1 }) // Sort by rental count, descending
      .skip(startIndex);

    const totalCars = await Car.countDocuments();

    const availableCars = await Car.countDocuments({ carStatus: "Available" });

    const lastMonthCarsCount = await Car.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
    });

    res.status(200).json({
      cars,
      totalCars,
      availableCars,
      lastMonthCars: lastMonthCarsCount,
    });
  } catch (error) {
    console.error("Error fetching cars:", error); // Log error for debugging
    next(error);
  }
};

export const deleteCar = async (req, res, next) => {
  try {
    const deletedCar = await Car.findByIdAndDelete(req.params.carId);
    if (!deletedCar) {
      return next(errorHandler(404, "car not found"));
    }
    res.status(200).json({ message: "The car has been deleted" });
  } catch (error) {
    console.error("Error deleting car:", error); // Log error for debugging
    next(error);
  }
};

export const editCar = async (req, res, next) => {
  try {
    const updatedCar = await Car.findByIdAndUpdate(
      req.params.carId,
      { $set: { ...req.body } }, // Use spread operator for flexibility
      { new: true, runValidators: true } // Ensures validation on update
    );

    if (!updatedCar) {
      return next(errorHandler(404, "car not found"));
    }

    res.status(200).json(updatedCar);
  } catch (error) {
    console.error("Error updating car:", error); // Log error for debugging
    next(error);
  }
};

export const getCar = async (req, res, next) => {
  try {
    const car = await Car.findById(req.params.carId);
    if (!car) {
      return next(errorHandler(404, "car not found"));
    }
    res.status(200).json(car);
  } catch (error) {
    console.error("Error fetching car:", error); // Log error for debugging
    next(error);
  }
};
