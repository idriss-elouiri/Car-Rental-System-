import mongoose from "mongoose";

const carSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    carNumber: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },  
    vehicleYear: {
      type: String,
      required: true,
    },
    rentalCount: { 
      type: Number,
      default: 0,
    },
    carStatus: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
  
const Car = mongoose.model("Car", carSchema);

export default Car;
