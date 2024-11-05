import Customer from "./customer.model";

export const createCustomer = async (req, res, next) => {
  const newCustomer = new Customer({
    ...req.body,
  });

  try {
    const savedCustomer = await newCustomer.save();
    res.status(201).json(savedCustomer);
  } catch (error) {
    console.error("Error creating customer:", error); // Log error for debugging
    next(error);
  }
};
