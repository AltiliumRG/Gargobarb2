// backend/src/models/Barbershop.js
const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Barbershop = sequelize.define(
  "Barbershop",
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    name: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    /* 🌍 CAMPOS DE UBICACIÓN EXTENDIDOS
       Relacionado con:
       - StepBasicInfo.jsx (Selector de ubicación)
       - LocationData.js (Fuente de datos)
    */
    country: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: "Colombia",
    },
    department: {
      type: DataTypes.STRING(100),
    },
    city: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    /* 📍 GEOLOCALIZACIÓN
       Almacenamos coordenadas para el mapa dinámico.
    */
    latitude: {
      type: DataTypes.DECIMAL(10, 8),
    },
    longitude: {
      type: DataTypes.DECIMAL(11, 8),
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: "barbershops",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

module.exports = Barbershop;
