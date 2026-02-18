// backend/src/models/SitePage.js
const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const SitePage = sequelize.define(
  "SitePage",
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
    title: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    order_index: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    tableName: "site_pages",
    timestamps: false,
  }
);

module.exports = SitePage;
