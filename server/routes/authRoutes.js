// Routes for authentication
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authControllers");

// Register Route: POST /api/auth/register
router.post("/register", authController.registerUser);

// Login Route: POST /api/auth/login
router.post("/login", authController.loginUser);

module.exports = router;
