const sendResponse = require("../utils/sendResponse");
const demoService = require("../services/demo.service");
const generateToken = require("../utils/generateToken");
const demoSeedService = require("../services/demoSeed.service");



async function loginDemo(req, res) {
  const { user } = await demoService.getOrCreateDemoUser();

  try {
    await demoSeedService.setupDemoData(user);
  } catch (err) {
    console.error("DEMO SEED FAILED");
    console.error(err);
    throw err;
  }

  const token = generateToken(user._id);

  res.cookie("token", token);

  return sendResponse(res, 200, "Demo login successful", {
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
    },
    token,
  });
}

module.exports = {
  loginDemo,
};