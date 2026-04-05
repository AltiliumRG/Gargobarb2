const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const BarbershopVisit = sequelize.define("BarbershopVisit", {
  id: {
    type: DataTypes.BIGINT.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  barbershop_id: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
  },
  visitor_id: {
    type: DataTypes.STRING, // anonymous id from client (uuid)
    allowNull: false,
  },
  duration_seconds: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  page: {
    type: DataTypes.STRING,
    defaultValue: "home",
  }
}, {
  timestamps: true,
  underscored: true,
  tableName: "barbershop_visits",
  createdAt: "created_at",
  updatedAt: "updated_at",
});

module.exports = BarbershopVisit;
