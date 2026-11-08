const User = require("../models/User");
const Tool = require("../models/Tool");
const Rental = require("../models/Rental");

// ==========================================
// 1. ANALYTICS & OVERVIEW
// ==========================================

// Get platform analytics overview
const getAdminStats = async function (req, res) {
  try {
    const totalUsers = await User.count();
    const totalTools = await Tool.count();
    const totalRentals = await Rental.count();
    const activeRentals = await Rental.count({ where: { status: "Active" } });

    // Calculate platform revenue from completed rentals
    const totalRevenue = (await Rental.sum("totalPrice", {
      where: { status: "completed" },
    })) || 0;

    res.status(200).json({
      totalUsers,
      totalTools,
      totalRentals,
      activeRentals,
      totalRevenue,
    });
  } catch (err) {
    console.error("Error fetching admin stats:", err);
    res.status(500).json({ message: "Server error while fetching admin analytics" });
  }
};

// ==========================================
// 2. USER MANAGEMENT (CRUD)
// ==========================================

// Get all users on the platform
const getAllUsers = async function (req, res) {
  try {
    const users = await User.findAll({
      attributes: { exclude: ["password"] },
    });
    res.status(200).json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ message: "Server error while fetching users" });
  }
};

// Update user details or role
const updateUser = async function (req, res) {
  try {
    const userId = req.params.id;
    const { name, email, role } = req.body;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    // Prevent admin from removing their own admin status
    if (parseInt(userId, 10) === req.user.id && role && role.toLowerCase() !== "admin") {
      return res.status(400).json({ message: "Cannot remove your own admin privileges!" });
    }

    if (name !== undefined) user.name = name;
    if (email !== undefined) user.email = email;
    if (role !== undefined) user.role = role.toLowerCase();

    await user.save();

    const updatedUser = user.toJSON();
    delete updatedUser.password;

    res.status(200).json({
      message: "User updated successfully by admin!",
      user: updatedUser,
    });
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ message: "Server error while updating user" });
  }
};

// Delete a user
const deleteUser = async function (req, res) {
  try {
    const userId = req.params.id;

    if (parseInt(userId, 10) === req.user.id) {
      return res.status(400).json({ message: "Cannot delete your own admin account!" });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    await user.destroy();
    res.status(200).json({ message: "User deleted successfully by admin!" });
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({ message: "Server error while deleting user" });
  }
};

// ==========================================
// 3. TOOL MANAGEMENT & MODERATION (CRUD)
// ==========================================

// Get all tools listed on the platform with owner details
const getAllTools = async function (req, res) {
  try {
    const tools = await Tool.findAll({
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
    console.error("Error fetching tools:", err);
    res.status(500).json({ message: "Server error while fetching tools" });
  }
};

// Update tool details (Moderation/Edit by Admin)
const updateTool = async function (req, res) {
  try {
    const toolId = req.params.id;
    const { name, description, category, pricePerDay, isAvailable, imageUrl } = req.body;

    const tool = await Tool.findByPk(toolId);
    if (!tool) {
      return res.status(404).json({ message: "Tool not found!" });
    }

    if (name !== undefined) tool.name = name;
    if (description !== undefined) tool.description = description;
    if (category !== undefined) tool.category = category;
    if (pricePerDay !== undefined) tool.pricePerDay = pricePerDay;
    if (isAvailable !== undefined) tool.isAvailable = isAvailable;
    if (imageUrl !== undefined) tool.imageUrl = imageUrl;

    await tool.save();

    res.status(200).json({
      message: "Tool listing updated successfully by admin!",
      tool,
    });
  } catch (err) {
    console.error("Error updating tool:", err);
    res.status(500).json({ message: "Server error while updating tool" });
  }
};

// Delete a tool listing (Moderation by Admin)
const deleteTool = async function (req, res) {
  try {
    const toolId = req.params.id;
    const tool = await Tool.findByPk(toolId);

    if (!tool) {
      return res.status(404).json({ message: "Tool not found!" });
    }

    await tool.destroy();
    res.status(200).json({ message: "Tool listing removed successfully by admin!" });
  } catch (err) {
    console.error("Error deleting tool:", err);
    res.status(500).json({ message: "Server error while removing tool listing" });
  }
};

module.exports = {
  getAdminStats,
  getAllUsers,
  updateUser,
  deleteUser,
  getAllTools,
  updateTool,
  deleteTool,
};