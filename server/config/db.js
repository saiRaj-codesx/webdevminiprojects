// Database configuration file
const { Sequelize } = require("sequelize");

// Creating connection to mysql database using environment variables
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST || "localhost",
    dialect: "mysql",
    logging: false, // Optional: set to true if you want to see raw SQL queries in your console
  },
);

// Function to test if connection works
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("MySQL Database Connected Successfully!");
  } catch (error) {
    console.log("Database connection failed:");
    console.error(error);
  }
};

module.exports = {
  sequelize,
  connectDB,
};
