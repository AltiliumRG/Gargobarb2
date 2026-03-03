const Barbershop = require("./Barbershop");
const User = require("./User");
const BarbershopSite = require("./BarbershopSite");
const SitePage = require("./SitePage");
const SiteSection = require("./SiteSection");
const Service = require("./Service");
const BarberSchedule = require("./BarberSchedule");
const Appointment = require("./Appointment");
const { sequelize } = require("../config/db");
/* ===============================
   USER → BARBERSHOPS
================================*/
User.hasMany(Barbershop, {
  foreignKey: "user_id",
  as: "ownedBarbershops",
});

Barbershop.belongsTo(User, {
  foreignKey: "user_id",
  as: "owner",
});

/* ===============================
   BARBERSHOP → SITE
================================*/
Barbershop.hasOne(BarbershopSite, {
  foreignKey: "barbershop_id",
  as: "site",
});

BarbershopSite.belongsTo(Barbershop, {
  foreignKey: "barbershop_id",
});

/* ===============================
   SITE → PAGES
================================*/
BarbershopSite.hasMany(SitePage, {
  foreignKey: "site_id",
  as: "pages",
});

SitePage.belongsTo(BarbershopSite, {
  foreignKey: "site_id",
});

/* ===============================
   PAGE → SECTIONS
================================*/
SitePage.hasMany(SiteSection, {
  foreignKey: "page_id",
  as: "sections",
});

SiteSection.belongsTo(SitePage, {
  foreignKey: "page_id",
});

/* ===============================
   BARBERSHOP → SERVICES
================================*/
Barbershop.hasMany(Service, {
  foreignKey: "barbershop_id",
  as: "services",
});

Service.belongsTo(Barbershop, {
  foreignKey: "barbershop_id",
});

/* ===============================
   BARBERSHOP → SCHEDULE
================================*/
Barbershop.hasMany(BarberSchedule, {
  foreignKey: "barbershop_id",
  as: "schedule",
});

BarberSchedule.belongsTo(Barbershop, {
  foreignKey: "barbershop_id",
});

/* ===============================
   APPOINTMENTS
================================*/
User.hasMany(Appointment, { foreignKey: "user_id" });
Appointment.belongsTo(User, { foreignKey: "user_id", as: "client" }); // "client" para evitar conflictos con el modelo User

Barbershop.hasMany(Appointment, { foreignKey: "barbershop_id" });
Appointment.belongsTo(Barbershop, { foreignKey: "barbershop_id", as: "barbershop" });

Service.hasMany(Appointment, { foreignKey: "service_id" });
Appointment.belongsTo(Service, { foreignKey: "service_id", as: "service" });

module.exports = {
  sequelize,
  Barbershop,
  User,
  BarbershopSite,
  SitePage,
  SiteSection,
  Service,
  BarberSchedule,
  Appointment,
};
