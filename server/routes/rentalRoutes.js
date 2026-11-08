// Routes for managing rentals
const express = require("express");
const router = express.Router();
const rentalController = require("../controllers/rentalController");
const verifyToken = require("../middleware/authMiddleware");

// Create a rental request (Protected)
router.post("/", verifyToken, rentalController.createRental);

// Get user's borrowed items and incoming requests (Protected)
router.get("/my-rentals", verifyToken, rentalController.getUserRentals);

// Update rental status (Protected)
router.patch("/:id/status", verifyToken, rentalController.updateRentalStatus);

module.exports = router;
