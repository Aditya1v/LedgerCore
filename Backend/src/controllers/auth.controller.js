const userModel = require("../models/user.model");
const generateToken = require("../utils/generateToken");
const emailService = require("../services/email.service");
const tokenblackListModel = require("../models/blackList.model");
const AppError = require("../utils/AppError");
const sendResponse = require("../utils/sendResponse");

/**
 * - User register controller
 * - POST /api/auth/register
 */
async function userRegisterController(req, res) {
  const { email, password, name } = req.body;

  const isExists = await userModel.findOne({
    email,
  });

  if (isExists) {
    throw new AppError("User already exists with this email", 422);
  }

  const user = await userModel.create({
    email,
    password,
    name,
  });

  const token = generateToken(user._id);

  res.cookie("token", token);

  // Send registration email
  // Email failure should NOT break successful registration.
  
  console.log("📧 Registration email triggered for:", user.email);

try {
  await emailService.sendRegistrationEmail(
    user.email,
    user.name
  );

  console.log("✅ Registration email function completed");
} catch (error) {
  console.error(
    "❌ Registration email failed:",
    error
  );
}

  sendResponse(res, 201, "User registered successfully", {
    user: {
      _id: user._id,
      email: user.email,
      name: user.name,
    },
    token,
  });
}

/**
 * - User Login Controller
 * - POST /api/auth/login
 */
async function userLoginController(req, res) {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email }).select("+password");

  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  const isValidPassword = await user.comparePassword(password);

  if (!isValidPassword) {
    throw new AppError("Invalid email or password", 401);
  }

  const token = generateToken(user._id);

  res.cookie("token", token);

  sendResponse(res, 200, "Login successful", {
    user: {
      _id: user._id,
      email: user.email,
      name: user.name,
    },
    token,
  });
}

/**
 * - Update Profile Controller
 * - PUT /api/auth/profile
 */
async function updateProfileController(req, res) {
  const { name, email } = req.body;

  const existingUser = await userModel.findOne({
    email,
    _id: { $ne: req.user._id },
  });

  if (existingUser) {
    throw new AppError("Email already exists", 409);
  }

  const user = await userModel.findById(req.user._id);

  user.name = name;
  user.email = email;

  await user.save();

  return sendResponse(res, 200, "Profile updated successfully", {
    _id: user._id,
    name: user.name,
    email: user.email,
  });
}

/**
 * - Change Password Controller
 * - PUT /api/auth/change-password
 */
async function changePasswordController(req, res) {
  console.log(req.body);

  const { currentPassword, newPassword } = req.body;

  const user = await userModel.findById(req.user._id).select("+password");

  const isValidPassword = await user.comparePassword(currentPassword);

  if (!isValidPassword) {
    throw new AppError("Current password is incorrect", 400);
  }

  user.password = newPassword;

  await user.save();

  return sendResponse(res, 200, "Password changed successfully");
}

/**
 * - User Logout Controller
 * - POST /api/auth/logout
 */
async function userLogoutController(req, res) {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    throw new AppError("User is not logged in", 400);
  }

  await tokenblackListModel.create({
    token,
  });

  res.clearCookie("token");

  sendResponse(res, 200, "User logged out successfully");
}

/**
 * - Current User Controller
 * - GET /api/auth/me
 */
async function currentUserController(req, res) {
  res.set("Cache-Control", "no-store");

  return sendResponse(res, 200, "Current user fetched successfully", req.user);
}

module.exports = {
  userRegisterController,
  userLoginController,
  updateProfileController,
  changePasswordController,
  userLogoutController,
  currentUserController,
};
 