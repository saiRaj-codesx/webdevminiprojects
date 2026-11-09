require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const { sequelize } = require("./models/index");
const { connectDB } = require("./config/db");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes Imports
const authRoutes = require("./routes/authRoutes");
const toolRoutes = require("./routes/toolRoutes");
const rentalRoutes = require("./routes/rentalRoutes");
const adminRoutes = require("./routes/adminRoutes");

// API Route Mounts
app.use("/api/auth", authRoutes);
app.use("/api/tools", toolRoutes);
app.use("/api/rentals", rentalRoutes);
app.use("/api/admin", adminRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Basic test route
app.get("/", (req, res) => {
  res.send("ToolX API is running...");
});

// Connect DB and sync models
connectDB();

sequelize
  .sync({ force: false })
  .then(() => {
    console.log("Database synced successfully!");
  })
  .catch((err) => {
    console.log("Error syncing database:", err);
  });

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
