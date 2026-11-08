// Controller for handling tool operations
const Tool = require("../models/Tool");
const User = require("../models/User");
const { Op } = require("sequelize");

// 1. Get all tools (with optional search and category filters)
const getAllTools = async function (req, res) {
  try {
    const { search, category } = req.query;
    let condition = {};

    // If user typed something in search bar
    if (search) {
      condition.title = { [Op.like]: "%" + search + "%" };
    }

    // If user selected a category filter
    if (category && category !== "All") {
      condition.category = category;
    }

    const tools = await Tool.findAll({
      where: condition,
      include: [
        {
          model: User,
          as: "owner",
          attributes: ["id", "name", "email"],
        },
      ],
    });

    res.status(200).json(tools);
  } catch (err) {
    console.log("Error fetching tools:", err);
    res.status(500).json({ message: "Server error while fetching tools" });
  }
};

// 2. Add a new tool
const addTool = async function (req, res) {
  try {
    // Removed imageURL from here so it doesn't clash
    const { title, description, category, dailyRate, location } = req.body;

    // ownerId comes from the decoded JWT token in authMiddleware
    const ownerId = req.user.id;

    if (!title || !description || !category || !dailyRate || !location) {
      return res
        .status(400)
        .json({ message: "Please fill all required fields!" });
    }

    // Determine image path from Multer file or fallback URL
    const imageURL = req.file
      ? `/uploads/${req.file.filename}`
      : req.body.imageURL || "https://via.placeholder.com/150";

    const newTool = await Tool.create({
      title: title,
      description: description,
      category: category,
      dailyRate: dailyRate,
      location: location,
      imageURL: imageURL,
      ownerId: ownerId,
    });

    res.status(201).json({
      message: "Tool added successfully!",
      tool: newTool,
    });
  } catch (err) {
    console.log("Error adding tool:", err);
    res.status(500).json({ message: "Server error while adding tool" });
  }
};
const updateTool = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, category, dailyRate, location } = req.body;

    const tool = await Tool.findByPk(id);

    if (!tool) {
      return res.status(404).json({ message: "Tool not found" });
    }

    // Check if the logged-in user is the owner
    if (tool.ownerId !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Unauthorized to update this tool" });
    }

    // Handle new uploaded image file if present, otherwise keep existing imageURL
    const imageURL = req.file ? `/uploads/${req.file.filename}` : tool.imageURL;

    // Update fields
    tool.title = title || tool.title;
    tool.description = description || tool.description;
    tool.category = category || tool.category;
    tool.dailyRate = dailyRate || tool.dailyRate;
    tool.location = location || tool.location;
    tool.imageURL = imageURL;

    await tool.save();

    res.json({ message: "Tool updated successfully", tool });
  } catch (err) {
    console.log("Error updating tool:", err);
    res.status(500).json({ error: err.message });
  }
};

// 3. Delete a tool (only by owner or admin)
const deleteTool = async function (req, res) {
  try {
    const toolId = req.params.id;
    const tool = await Tool.findByPk(toolId);

    if (!tool) {
      return res.status(404).json({ message: "Tool not found!" });
    }

    // Check if logged-in user is the owner or an admin
    if (tool.ownerId !== req.user.id && req.user.role !== "Admin") {
      return res
        .status(403)
        .json({ message: "Unauthorized to delete this tool!" });
    }

    await tool.destroy();
    res.status(200).json({ message: "Tool deleted successfully!" });
  } catch (err) {
    console.log("Error deleting tool:", err);
    res.status(500).json({ message: "Server error while deleting tool" });
  }
};
// Get tools listed by logged-in user
const getUserListings = async (req, res) => {
  try {
    // FIX: use ownerId instead of UserId to match your model definition
    const tools = await Tool.findAll({ where: { ownerId: req.user.id } });
    res.json(tools);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching user listings", error: error.message });
  }
};

// Get single tool by ID
const getToolById = async (req, res) => {
  try {
    const { id } = req.params;
    const tool = await Tool.findByPk(id, {
      include: [
        {
          model: User,
          as: "owner", // FIX: added the correct association alias
          attributes: ["id", "name", "email"],
        },
      ],
    });

    if (!tool) {
      return res.status(404).json({ message: "Tool not found" });
    }

    res.json(tool);
  } catch (err) {
    console.error("Error fetching tool by ID:", err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllTools: getAllTools,
  addTool: addTool,
  deleteTool: deleteTool,
  updateTool: updateTool,
  getUserListings: getUserListings,
  getToolById: getToolById,
};
