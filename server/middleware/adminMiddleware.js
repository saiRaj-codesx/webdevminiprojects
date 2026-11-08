// Middleware to check if user has Admin role
const verifyAdmin = function (req, res, next) {
  // req.user comes from the previous verifyToken middleware
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res.status(403).json({ message: "Access denied! Admins only." });
  }
};

module.exports = verifyAdmin;
