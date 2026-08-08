const jwt = require("jsonwebtoken");

function generateToken(userId) {
  return jwt.sign(
    { userID: userId },
    process.env.JWT_SECRET,
    {
      expiresIn: "3d",
    }
  );
}

module.exports = generateToken;