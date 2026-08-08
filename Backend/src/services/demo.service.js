const userModel = require("../models/user.model");

async function getOrCreateDemoUser() {
  let demoUser = await userModel
    .findOne({
      email: "demo@ledgercore.com",
    })
    .select("+password +systemUser");

  if (demoUser) {
    return {
      user: demoUser,
      isNew: false,
    };
  }

  demoUser = await userModel.create({
    name: "LedgerCore Demo",

    email: "demo@ledgercore.com",

    password: "demo123",

    demo: true,
  });
const safeUser = demoUser.toObject();
delete safeUser.password;
  return {
    user: safeUser,
    isNew: true,
  };
}

module.exports = {
  getOrCreateDemoUser,
};