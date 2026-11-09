// Middleware to check if user is logged in using JWT
const jwt = require("jsonwebtoken");

const verifyToken = function (req, res, next) {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res
      .status(401)
      .json({ message: "No token provided, access denied!" });
  }

  // Token usually comes as "Bearer <token>"
  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token format is incorrect!" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // <-- Updated to use env variable!
    req.user = decoded; // Saving user info (id, role) in request object
    next(); // Move to the next function/route
  } catch (err) {
    console.log("Token verification failed:", err);
    return res.status(403).json({ message: "Token is invalid or expired!" });
  }
};

module.exports = verifyToken;