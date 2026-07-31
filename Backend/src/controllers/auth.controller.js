const userModel = require('../models/user.model')
const jwt = require('jsonwebtoken')
const emailService = require('../services/email.service')
const tokenblackListModel = require('../models/blackList.model')
const AppError = require("../utils/AppError");
const sendResponse = require("../utils/sendResponse");

/** 
* - User register controller
* - POST /api/auth/register
*/
async function userRegisterController(req, res){

  const { email, password, name } = req.body

  const isExists = await userModel.findOne({
    email:email
  })

  if(isExists){
    throw new AppError("User already exists with this email", 422);
  }

  const user = await userModel.create({
    email,password,name
  })

  const token = jwt.sign({userID:user._id} , process.env.JWT_SECRET, {expiresIn:"3d"})

  res.cookie("token" , token)

  sendResponse(
    res,
    201,
    "User registered successfully",
    {
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
      },
      token,
    }
  );
  
  await emailService.sendRegistrationEmail(user.email,user.name)

  //register api completed
}

/**
 * - User Login Controller
 * - POST /api/auth/login
 */
async function userLoginController(req , res){

  const {email , password} = req.body

  const user = await userModel.findOne({email}).select("+password")

  if(!user){
    throw new AppError("Invalid email or password", 401);
  }

  const isValidPassword = await user.comparePassword(password)

  if(!isValidPassword){
    throw new AppError("Invalid email or password",401);
  }

  const token = jwt.sign({userID:user._id} , process.env.JWT_SECRET, {expiresIn:"3d"})

  res.cookie("token" , token)

  sendResponse(
    res,
    200,
    "Login successful",
    {
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
      },
      token,
    }
  );
}

/**
 * - User Logout Controller
 * - POST /api/auth/logout
 */
async function userLogoutController(req , res){

  const token = req.cookies.token || req.headers.authorization?.split(" ")[1]

  if(!token){
    throw new AppError("User is not logged in",400);
  }

  // Add the token to the blacklist
  await tokenblackListModel.create({ token })

  // Clear the cookie
  res.clearCookie("token")

  sendResponse(
    res,
    200,
    "User logged out successfully"
  );
}

/**
 * - Current User Controller
 * - GET /api/auth/me
 */
async function currentUserController(req, res) {
  return sendResponse(
    res,
    200,
    "Current user fetched successfully",
    req.user
  );
}

module.exports = {
  userRegisterController,
  userLoginController,
  userLogoutController,
  currentUserController
}