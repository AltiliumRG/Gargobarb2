const TemplateService = require("../services/siteTemplate.service");

exports.getSectionTemplate = (req, res) => {
  try {
    const { type } = req.params;

    const template = TemplateService.loadTemplate("default");

    if (!template?.pages) {
      return res.status(404).json({ error: "Template inválido" });
    }

    let sectionTemplate = null;

    template.pages.forEach(page => {
      const found = page.sections.find(s => s.type === type);
      if (found) sectionTemplate = found;
    });

    if (!sectionTemplate) {
      return res.status(404).json({ error: "Sección no encontrada en template" });
    }

    res.json(sectionTemplate);

  } catch (err) {
    console.error("❌ getSectionTemplate:", err);
    res.status(500).json({ error: "Error cargando template" });
  }
};