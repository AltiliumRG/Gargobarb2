// backend/src/models/SiteSection.js
const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const SiteSection = sequelize.define(
  "SiteSection",
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    page_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM(
        "hero",
        "services",
        "gallery",
        "about",
        "testimonials",
        "contact",
        "cart",
        "custom"
      ),
      allowNull: false,
    },
    order_index: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    content: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    styles: {
      type: DataTypes.JSON,
    },
    is_visible: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: "site_sections",
    timestamps: false,
  }
);

module.exports = SiteSection;
