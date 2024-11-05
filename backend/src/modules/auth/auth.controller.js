import bcryptjs from "bcryptjs";
import { errorHandler } from "../../utils/error.js";
import User from "./auth.model.js";

export const registerHandler = async (req, res, next) => {
  const { username, password } = req.body;

  // Validate required fields
  if (!username || !password) {
    return next(errorHandler(400, "username, and password are required."));
  }

  const hashedPassword = bcryptjs.hashSync(password, 10);

  try {
    const newUser = new User({
      username,
      password: hashedPassword,
    });

    await newUser.save();
    return res.status(201).json("Signup successful"); // Return here to prevent further execution
  } catch (error) {
    if (error.code === 11000) {
      return next(errorHandler(400, "username already exists."));
    }
    next(error);
  }
};

export const loginHandler = async (req, res, next) => {
  const { username, password } = req.body;

  try {
    const validUser = await User.findOne({ username });
    if (!validUser) {
      return next(errorHandler(404, "User not found"));
    }

    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) {
      return next(errorHandler(400, "Invalid password"));
    }

    const { password: pass, ...rest } = validUser._doc;

    return res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};
