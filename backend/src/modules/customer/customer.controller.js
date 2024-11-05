import Customer from "./customer.model.js";

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

export const getCustomers = async (req, res, next) => {
    try {
      const startIndex = parseInt(req.query.startIndex, 10) || 0;
      const sortDirection = req.query.sort === 'asc' ? 1 : -1;
  
      const customers = await Customer.find()
        .sort({ createdAt: sortDirection })
        .skip(startIndex)
  
      const totalCustomers = await Customer.countDocuments();
  
      // Get the count of Customers created in the last month
      const lastMonthCustomersCount = await Customer.countDocuments({
        createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
      });
  
      res.status(200).json({
        customers,
        totalCustomers,
        lastMonthCustomers: lastMonthCustomersCount,
      });
    } catch (error) {
      console.error("Error fetching customers:", error); // Log error for debugging
      next(error);
    }
  };

  export const deleteCustomer = async (req, res, next) => {
    try {
      const deletedCustomer = await Customer.findByIdAndDelete(req.params.customerId);
      if (!deletedCustomer) {
        return next(errorHandler(404, 'customer not found'));
      }
      res.status(200).json({ message: 'The customer has been deleted' });
    } catch (error) {
      console.error("Error deleting customer:", error); // Log error for debugging
      next(error);
    }
  };

  export const editCustomer = async (req, res, next) => {
    try {
      const updatedCustomer = await Customer.findByIdAndUpdate(
        req.params.customerId,
        { $set: { ...req.body } }, // Use spread operator for flexibility
        { new: true, runValidators: true } // Ensures validation on update
      );
  
      if (!updatedCustomer) {
        return next(errorHandler(404, 'customer not found'));
      }
      
      res.status(200).json(updatedCustomer);
    } catch (error) {
      console.error("Error updating customer:", error); // Log error for debugging
      next(error);
    }
  };
  
  export const getCustomer = async (req, res, next) => {
    try {
      const customer = await Customer.findById(req.params.customerId);
      if (!customer) {
        return next(errorHandler(404, 'customer not found'));
      }
      res.status(200).json(customer);
    } catch (error) {
      console.error("Error fetching customer:", error); // Log error for debugging
      next(error);
    }
  };