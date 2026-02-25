const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const BarbershopSite = sequelize.define(
  "BarbershopSite",
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    barbershop_id: {
<<<<<<< HEAD
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
    },
=======
  type: DataTypes.BIGINT.UNSIGNED,
  allowNull: false,
  references: {
    model: "barbershops",
    key: "id",
  },
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
},
>>>>>>> origin/David
    slug: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: true,
    },
    template: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    primary_color: {
      type: DataTypes.STRING(20),
      defaultValue: "#000000",
    },
    secondary_color: {
      type: DataTypes.STRING(20),
      defaultValue: "#ffffff",
    },
    font_family: {
      type: DataTypes.STRING(100),
      defaultValue: "Roboto",
    },
    status: {
      type: DataTypes.ENUM("draft", "published"),
      defaultValue: "draft",
    },
  },
  {
    tableName: "barbershop_sites",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

module.exports = BarbershopSite;
