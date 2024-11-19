import { errorHandler } from "../../utils/error.js";
import Admin from "../adminAuth/adminAuth.model.js";
import bcryptjs from "bcryptjs";
import Staff from "../staffAuth/staffAuth.model.js";

export const updateAdmin = async (req, res, next) => {
  console.log(req.params.adminId)
  console.log(req.user.id)
  if (req.user.id !== req.params.adminId) {
    return next(errorHandler(403, "You are not allowed to update this user"));
  }
  if (req.body.password) {
    req.body.password = bcryptjs.hashSync(req.body.password, 10);
  }
  try {
    const updatedAdmin = await Admin.findByIdAndUpdate(
      req.params.adminId,
      {
        $set: {
          name: req.body.name,
          email: req.body.email,
          profilePicture: req.body.profilePicture,
          password: req.body.password,
        },
      },
      { new: true }
    );
    const { password, ...rest } = updatedAdmin._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

export const deleteAdmin = async (req, res, next) => {
  if (req.user.id !== req.params.adminId) {
    return next(errorHandler(403, "You are not allowed to delete this user"));
  }
  try {
    await Admin.findByIdAndDelete(req.params.adminId);
    res.status(200).json("Admin has been deleted");
  } catch (error) {
    next(error);
  }
};

export const signout = (req, res, next) => {
  try {
    res
      .clearCookie("access_token")
      .status(200)
      .json("Admin has been signed out");
  } catch (error) {
    next(error);
  }
};

export const getAdmins = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, "You are not allowed to see all users"));
  }
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.sort === "asc" ? 1 : -1;

    const users = await Admin.find()
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const usersWithoutPassword = users.map((user) => {
      const { password, ...rest } = user._doc;
      return rest;
    });

    const totalAdmins = await Admin.countDocuments();

    const now = new Date();

    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );
    const lastMonthAdmins = await Admin.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({
      users: usersWithoutPassword,
      totalAdmins,
      lastMonthAdmins,
    });
  } catch (error) {
    next(error);
  }
};

export const getAdmin = async (req, res, next) => {
  try {
    const user = await Admin.findById(req.params.adminId);
    if (!user) {
      return next(errorHandler(404, "Admin not found"));
    }
    const { password, ...rest } = user._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

export const updateStaff = async (req, res, next) => {
  try {
    const { passwordStaff } = req.body;

    if (passwordStaff) {
      req.body.passwordStaff = bcryptjs.hashSync(passwordStaff, 10);
    }

    const updatedStaff = await Staff.findByIdAndUpdate(
      req.params.staffId,
      { $set: { ...req.body } },
      { new: true }
    );

    if (!updatedStaff) {
      return next(errorHandler(404, "Staff not found"));
    }

    const { passwordStaff: pass, ...rest } = updatedStaff._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

// Handler for deleting a staff member
export const deleteStaff = async (req, res, next) => {
  try {
    const deletedStaff = await Staff.findByIdAndDelete(req.params.staffId);
    if (!deletedStaff) {
      return next(errorHandler(404, "Staff not found"));
    }
    res.status(200).json({ message: "Staff has been deleted" });
  } catch (error) {
    next(error);
  }
};
