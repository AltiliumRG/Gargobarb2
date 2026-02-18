// ===============================================
// 📅 Modelo de horarios de barbería
// ===============================================
const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const BarberSchedule = sequelize.define(
  "BarberSchedule",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    barbershop_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
    },

    day: {
      type: DataTypes.STRING, // monday, tuesday, etc
      allowNull: false,
    },

    open_time: {
      type: DataTypes.TIME,
      allowNull: false,
    },

    close_time: {
      type: DataTypes.TIME,
      allowNull: false,
    },

    is_closed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "barber_schedules",
    timestamps: false,
  }
);

module.exports = BarberSchedule;
