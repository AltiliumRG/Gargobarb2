// ===============================================
// 📅 Modelo de horarios de barbería
// ===============================================

module.exports = (sequelize, DataTypes) => {
  const BarberSchedule = sequelize.define(
    "BarberSchedule",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      barbershop_id: {
        type: DataTypes.INTEGER,
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

  BarberSchedule.associate = (models) => {
    BarberSchedule.belongsTo(models.Barbershop, {
      foreignKey: "barbershop_id",
      as: "barbershop",
    });
  };

  return BarberSchedule;
};
