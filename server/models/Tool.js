// Tool model
const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Tool = sequelize.define("Tool", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  dailyRate: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  imageURL: {
    type: DataTypes.STRING,
  },
  ownerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = Tool;
