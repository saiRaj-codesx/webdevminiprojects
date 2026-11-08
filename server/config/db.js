// Database configuration file
const Sequelize = require("sequelize");

// Creating connection to mysql database
const sequelize = new Sequelize("toolrent_db", "root", "toxicsaiaf69@", {
  host: "localhost",
  dialect: "mysql",
});

// Function to test if connection works
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("MySQL Database Connected Successfully!");
  } catch (error) {
    console.log("Database connection failed:");
    console.log(error);
  }
};

module.exports = {
  sequelize: sequelize,
  connectDB: connectDB,
};
