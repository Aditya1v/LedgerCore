const accountModel = require('../models/account.model')
const AppError = require("../utils/AppError");


async function createAccountController(req, res){

  const user = req.user;
  const account = await accountModel.create({
    user: user._id
  })

  res.status(201).json({
    account
  })

}

async function getUserAccountsController(req,res){
  const accounts = await accountModel.find({user:req.user._id})

  res.status(200).json({
    accounts
  })
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
  
  res.status(200).json({
    accountId: account._id,
    balance
  })
}

module.exports = {createAccountController ,getUserAccountsController , getAccountBalanceController}