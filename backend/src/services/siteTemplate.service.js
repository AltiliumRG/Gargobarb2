// backend/src/services/SiteTemplateService.js
const fs = require("fs");
const path = require("path");

const TEMPLATES_PATH = path.join(__dirname, "../templates");

exports.loadTemplate = (templateName) => {
  const filePath = path.join(TEMPLATES_PATH, `${templateName}.template.json`);

  if (!fs.existsSync(filePath)) {
    throw new Error("Template no encontrado");
  }

  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw);
};
