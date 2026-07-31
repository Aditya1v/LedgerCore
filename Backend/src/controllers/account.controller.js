const accountModel = require('../models/account.model')
const AppError = require("../utils/AppError");
const sendResponse = require("../utils/sendResponse");


async function createAccountController(req, res){

  const user = req.user;
  const account = await accountModel.create({
    user: user._id
  })

  sendResponse(
    res,
    201,
    "Account created successfully",
    account
  );

}

async function getUserAccountsController(req,res){
  const accounts = await accountModel.find({user:req.user._id})

  sendResponse(
    res,
    200,
    "Accounts fetched successfully",
    accounts
  );
}

async function getAccountBalanceController(req,res){
  const {accountId} = req.params

  const account = await accountModel.findOne({
    _id: accountId,
    user: req.user._id
  })

  if(!account){
    throw new AppError("Account not found",404);
  }

  const balance = await account.getBalance();
  
  sendResponse(
    res,
    200,
    "Balance fetched successfully",
    {
      accountId: account._id,
      balance,
    }
  );
}

module.exports = {createAccountController ,getUserAccountsController , getAccountBalanceController}