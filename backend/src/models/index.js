const Barbershop = require("./Barbershop");
const User = require("./User");

const BarbershopSite = require("./BarbershopSite");
const SitePage = require("./SitePage");
const SiteSection = require("./SiteSection");

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

module.exports = {
  Barbershop,
  User,
  BarbershopSite,
  SitePage,
  SiteSection,
};
