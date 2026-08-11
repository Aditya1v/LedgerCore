const sendResponse = require("../utils/sendResponse");
const demoService = require("../services/demo.service");
const generateToken = require("../utils/generateToken");
const demoSeedService = require("../services/demoSeed.service");

async function loginDemo(req, res) {
  const { user, isNew } =
    await demoService.getOrCreateDemoUser();

  // Seed demo data ONLY when the demo user
  // is created for the first time.
  if (isNew) {
    try {
      console.log("🌱 First demo login detected.");
      console.log("🌱 Seeding demo data...");

      await demoSeedService.setupDemoData(user);

      console.log("✅ Demo data seeded successfully.");
    } catch (err) {
      console.error("❌ DEMO SEED FAILED");
      console.error(err);

      throw err;
    }
  } else {
    console.log(
      "ℹ️ Existing demo user. Skipping demo data seed."
    );
  }

  // Generate a fresh login token every time.
  const token = generateToken(user._id);

  res.cookie("token", token);

  return sendResponse(
    res,
    200,
    "Demo login successful",
    {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
      token,
    }
  );
}

module.exports = {
  loginDemo,
};