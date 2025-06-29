import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { errorHandler } from "../../utils/error.js";
import Admin from "./adminAuth.model.js";

export const registerHandler = async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return next(errorHandler(400, "Name, email, and password are required."));
  }

  const hashedPassword = bcryptjs.hashSync(password, 10);

  try {
    const newAdmin = new Admin({
      name,
      email,
      password: hashedPassword,
    });

    await newAdmin.save();
    return res.status(201).json("Signup successful");
  } catch (error) {
    if (error.code === 11000) {
      return next(errorHandler(400, "Email already exists."));
    }
    next(error);
  }
};

export const loginHandler = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const validAdmin = await Admin.findOne({ email });
    if (!validAdmin) {
      return next(errorHandler(404, "Admin not found"));
    }

    const validPassword = bcryptjs.compareSync(password, validAdmin.password);
    if (!validPassword) {
      return next(errorHandler(400, "Invalid password"));
    }

    const token = jwt.sign(
      { id: validAdmin._id, isAdmin: validAdmin.isAdmin },
      process.env.JWT_SECRET
    );

    const { password: pass, ...rest } = validAdmin._doc;

    return res
      .status(200)
      .cookie("access_token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production', 
          sameSite: 'None'
      })
      .json(rest);
  } catch (error) {
    next(error);
  }
};

export const googleHandler = async (req, res, next) => {
  const { email, name, googlePhotoUrl } = req.body;

  try {
    const user = await Admin.findOne({ email });
    let token, newAdmin;

    if (user) {
      token = jwt.sign(
        { id: user._id, isAdmin: user.isAdmin },
        process.env.JWT_SECRET
      );
      const { password, ...rest } = user._doc;
      return res
        .status(200)
        .cookie("access_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', 
            sameSite: 'None'
        })
        .json(rest);
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
      newAdmin = new Admin({
        name:
          name.toLowerCase().split(" ").join("") +
          Math.random().toString(9).slice(-4),
        email,
        password: hashedPassword,
        profilePicture: googlePhotoUrl,
      });
      await newAdmin.save();
      token = jwt.sign(
        { id: newAdmin._id, isAdmin: newAdmin.isAdmin },
        process.env.JWT_SECRET
      );
      const { password, ...rest } = newAdmin._doc;
      return res
        .status(200)
        .cookie("access_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', 
            sameSite: 'None'
        })
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
};
