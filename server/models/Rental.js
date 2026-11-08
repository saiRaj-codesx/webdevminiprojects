// Rental model
const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Rental = sequelize.define("Rental", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  startDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  endDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  totalPrice: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: "Requested", // options: Requested, Active, Returned, Cancelled
  },
  toolId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  renterId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = Rental;
