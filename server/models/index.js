// Associations file
const { sequelize } = require("../config/db");
const User = require("./User");
const Tool = require("./Tool");
const Rental = require("./Rental");

// User and Tool relation (One user has many tools)
User.hasMany(Tool, { foreignKey: "ownerId", onDelete: "CASCADE" });
Tool.belongsTo(User, { foreignKey: "ownerId", as: "owner" });

// User and Rental relation (One user has many rentals as a borrower)
User.hasMany(Rental, { foreignKey: "renterId", onDelete: "CASCADE" });
Rental.belongsTo(User, { foreignKey: "renterId", as: "renter" }); // <-- Added as: "renter"

// Tool and Rental relation (One tool has many rentals)
Tool.hasMany(Rental, { foreignKey: "toolId", onDelete: "CASCADE" });
Rental.belongsTo(Tool, { foreignKey: "toolId", as: "tool" }); // <-- Added as: "tool"

module.exports = {
  sequelize: sequelize,
  User: User,
  Tool: Tool,
  Rental: Rental,
};
