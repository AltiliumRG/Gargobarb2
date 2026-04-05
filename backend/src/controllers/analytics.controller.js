const { BarbershopVisit } = require("../models");

exports.trackVisit = async (req, res) => {
  try {
    const { barbershop_id, visitor_id, page } = req.body;

    if (!barbershop_id || !visitor_id) {
      return res.status(400).json({ error: "Faltan datos de rastreo" });
    }

    // Check if there's an active visit for this visitor in the last 30 minutes to update duration instead of creating a new one?
    // Actually, for simplicity, we create a new record and update it.
    const visit = await BarbershopVisit.create({
      barbershop_id,
      visitor_id,
      page: page || "home",
      duration_seconds: 0
    });

    res.status(201).json({ visit_id: visit.id });
  } catch (error) {
    console.error("❌ Error tracking visit:", error);
    res.status(500).json({ error: "Error interno" });
  }
};

exports.updateDuration = async (req, res) => {
  try {
    const { visit_id, duration_seconds } = req.body;

    if (!visit_id) return res.status(400).json({ error: "ID de visita requerido" });

    const visit = await BarbershopVisit.findByPk(visit_id);
    if (visit) {
      // We only update if the new duration is greater (to handle heartbeats)
      if (duration_seconds > visit.duration_seconds) {
        await visit.update({ duration_seconds });
      }
    }

    res.json({ success: true });
  } catch (error) {
    console.error("❌ Error updating duration:", error);
    res.status(500).json({ error: "Error interno" });
  }
};
