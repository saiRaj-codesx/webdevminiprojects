// Routes for admin management and analytics
const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const verifyToken = require("../middleware/authMiddleware");
const verifyAdmin = require("../middleware/adminMiddleware");

// All admin routes require both a valid token AND Admin role
router.use(verifyToken, verifyAdmin);

// Analytics
router.get("/stats", adminController.getAdminStats);

// User Management (CRUD)
router.get("/users", adminController.getAllUsers);
router.put("/users/:id", adminController.updateUser);
router.delete("/users/:id", adminController.deleteUser);

// Tool Management (CRUD / Moderation)
router.get("/tools", adminController.getAllTools);
router.put("/tools/:id", adminController.updateTool);
router.delete("/tools/:id", adminController.deleteTool);

module.exports = router;
