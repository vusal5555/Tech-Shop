import User from "../models/UserModel.js";
import asyncHandler from "express-async-handler";
import jsonTokenGenerator from "../utils/jwt.js";

//@desc Login user
//@route POST /api/users/login
//@access Public

export const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    // const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    //   expiresIn: "30d",
    // });

    // res.cookie("jwt", token, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV !== "development",
    //   sameSite: "strict",
    //   maxAge: 30 * 24 * 60 * 60 * 1000,
    // });
    jsonTokenGenerator(res, user);

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(401);
    throw new Error("invalid email or password");
  }
});

//@desc Register user
//@route POST /api/users
//@access Public

export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }
  const user = await User.create({ name, email, password });

  if (user) {
    jsonTokenGenerator(res, user);

    res.status(201).json({
      id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

//@desc Log out user and clear cookie
//@route POST /api/users/logout
//@access Private

export const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    expires: new Date(0),
  });

  res.status(200).json({ msg: "user logged out" });
});

//@desc Get user profile
//@route GET /api/users/profile
//@access Private

export const getUserProfile = asyncHandler(async (req, res) => {
  const { email } = req.user;
  const user = await User.findOne({ email });

  if (user) {
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

//@desc Update user profile
//@route PUT /api/users/profile
//@access Private

export const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      user.password = req.body.password || user.password;
    }

    await user.save();

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

//@desc Get all users
//@route GET /api/users
//@access Private/Admin

export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});

  res.status(200).json(users);
});

//@desc delete users
//@route DELETE /api/users/:id
//@access Private/Admin

export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);

  if (user.isAdmin) {
    res.status(400);
    throw new Error("Cannot deleted admin user");
  }

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  res.status(200).json({ msg: "user deleted successfully" });
});

//@desc update users
//@route PUT /api/users/:id
//@access Private/Admin

export const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    user.isAdmin = Boolean(req.body.isAdmin) || user.isAdmin;

    const updatedUser = await user.save();

    res.status(200).json(updatedUser);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

//@desc Get all users
//@route GET /api/users
//@access Private/Admin

export const getSingleUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");

  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});
