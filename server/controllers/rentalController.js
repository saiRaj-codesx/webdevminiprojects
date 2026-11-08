// Controller for handling tool rentals and date-collision logic
const Rental = require("../models/Rental");
const Tool = require("../models/Tool");
const User = require("../models/User");
const { Op } = require("sequelize");

// 1. Request to rent a tool (with date collision validation)
const createRental = async function (req, res) {
  try {
    const { toolId, startDate, endDate } = req.body;
    const renterId = req.user.id;

    if (!toolId || !startDate || !endDate) {
      return res
        .status(400)
        .json({ message: "Please provide toolId, startDate, and endDate!" });
    }

    // --- NEW DATE VALIDATION GUARD ---
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format

    if (startDate < today) {
      return res.status(400).json({
        message: "Start date cannot be in the past!",
      });
    }

    if (endDate < startDate) {
      return res.status(400).json({
        message: "End date must be on or after the start date!",
      });
    }
    // ---------------------------------

    // Check if tool exists
    const tool = await Tool.findByPk(toolId);
    if (!tool) {
      return res.status(404).json({ message: "Tool not found!" });
    }

    // Users cannot rent their own tool
    if (tool.ownerId === renterId) {
      return res
        .status(400)
        .json({ message: "You cannot rent your own tool!" });
    }

    // Date collision check logic:
    const conflictingRental = await Rental.findOne({
      where: {
        toolId: toolId,
        status: {
          [Op.in]: ["Requested", "Active"],
        },
        [Op.and]: [
          { startDate: { [Op.lte]: endDate } },
          { endDate: { [Op.gte]: startDate } },
        ],
      },
    });

    if (conflictingRental) {
      return res.status(400).json({
        message:
          "Tool is already booked or requested for these dates! Please choose different dates.",
      });
    }

    // Calculate total price based on daily rate and number of days
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // inclusive of start day
    const totalPrice = diffDays * tool.dailyRate;

    // Create the rental record
    const newRental = await Rental.create({
      startDate: startDate,
      endDate: endDate,
      totalPrice: totalPrice,
      status: "Requested",
      toolId: toolId,
      renterId: renterId,
    });

    res.status(201).json({
      message: "Rental request submitted successfully!",
      rental: newRental,
    });
  } catch (err) {
    console.log("Error creating rental:", err);
    res
      .status(500)
      .json({ message: "Server error while creating rental request" });
  }
};

// 2. Get user rentals (Borrowed items & incoming requests for owned tools)
const getUserRentals = async function (req, res) {
  try {
    const userId = req.user.id;

    // Items borrowed by this user
    const borrowedItems = await Rental.findAll({
      where: { renterId: userId },
      include: [
        {
          model: Tool,
          as: "tool",
          include: [
            { model: User, as: "owner", attributes: ["id", "name", "email"] },
          ],
        },
      ],
    });

    // Tools owned by this user
    const myTools = await Tool.findAll({ where: { ownerId: userId } });
    const myToolIds = myTools.map(function (tool) {
      return tool.id;
    });

    // Incoming requests for tools owned by this user
    let incomingRequests = [];
    if (myToolIds.length > 0) {
      incomingRequests = await Rental.findAll({
        where: { toolId: { [Op.in]: myToolIds } },
        include: [
          { model: Tool, as: "tool" },
          { model: User, as: "renter", attributes: ["id", "name", "email"] },
        ],
      });
    }

    res.status(200).json({
      borrowedItems: borrowedItems,
      incomingRequests: incomingRequests,
    });
  } catch (err) {
    console.log("Error fetching user rentals:", err);
    res.status(500).json({ message: "Server error while fetching rentals" });
  }
};

// 3. Update rental status (Approve to Active, mark Returned, or Cancel)
const updateRentalStatus = async function (req, res) {
  try {
    const rentalId = req.params.id;
    const { status } = req.body; // e.g., 'Active', 'Returned', 'Cancelled'

    const rental = await Rental.findByPk(rentalId, {
      include: [{ model: Tool, as: "tool" }],
    });

    if (!rental) {
      return res.status(404).json({ message: "Rental request not found!" });
    }

    // Check if user is tool owner or the person who rented it (or Admin)
    const isOwner = rental.tool.ownerId === req.user.id;
    const isRenter = rental.renterId === req.user.id;
    const isAdmin = req.user.role === "Admin";

    if (!isOwner && !isRenter && !isAdmin) {
      return res
        .status(403)
        .json({ message: "Unauthorized to update this rental status!" });
    }

    rental.status = status;
    await rental.save();

    res.status(200).json({
      message: "Rental status updated to " + status,
      rental: rental,
    });
  } catch (err) {
    console.log("Error updating rental status:", err);
    res
      .status(500)
      .json({ message: "Server error while updating rental status" });
  }
};

module.exports = {
  createRental: createRental,
  getUserRentals: getUserRentals,
  updateRentalStatus: updateRentalStatus,
};
