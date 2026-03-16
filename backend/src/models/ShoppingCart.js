// backend/src/models/ShoppingCart.js
const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const ShoppingCart = sequelize.define(
  "ShoppingCart",
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    site_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
    },
    client_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    client_phone: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    items: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("pending", "completed", "cancelled"),
      defaultValue: "pending",
    },
  },
  {
    tableName: "shopping_carts",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

module.exports = ShoppingCart;
