// backend/src/models/Order.js
const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Order = sequelize.define(
  "Order",
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    site_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      references: {
        model: "barbershop_sites",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    client_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    client_email: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    client_phone: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    /* 📦 Productos comprados (JSON array de items) */
    items: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    total: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
    payment_method: {
      type: DataTypes.ENUM("card", "transfer", "nequi", "efectivo"),
      allowNull: false,
    },
    /* Referencia de transacción (número de comprobante) */
    transaction_ref: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("pending", "completed", "cancelled", "refunded"),
      defaultValue: "completed",
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "orders",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

module.exports = Order;
