// Routes for tools management
const express = require("express");
const router = express.Router();
const toolController = require("../controllers/toolController");
const verifyToken = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

router.get("/", toolController.getAllTools);

// Protected route to fetch user-specific listings (must be placed before /:id)
router.get("/my-listings", verifyToken, toolController.getUserListings);

// GET single tool by ID (Added here!)
router.get("/:id", toolController.getToolById);

// Protected routes to manage tools
router.post("/", verifyToken, upload.single("image"), toolController.addTool);
router.put(
  "/:id",
  verifyToken,
  upload.single("image"),
  toolController.updateTool,
);
router.delete("/:id", verifyToken, toolController.deleteTool);

module.exports = router;
