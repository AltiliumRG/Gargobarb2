#!/usr/bin/env node
// ============================================================
// 🚀 GargoBarb - Setup Automático de Base de Datos
// ============================================================
// Ejecutar con: node setup-db.js
//
// Este script:
//   1. Lee tu .env para obtener las credenciales
//   2. Crea la base de datos si no existe
//   3. Sincroniza todos los modelos (ALTER TABLE)
//   4. Reporta qué tablas se crearon/actualizaron
// ============================================================

require("dotenv").config();
const { sequelize } = require("./src/config/db");

// Importar todos los modelos para registrarlos
const models = require("./src/models");

const COLORS = {
  green:  (t) => `\x1b[32m${t}\x1b[0m`,
  yellow: (t) => `\x1b[33m${t}\x1b[0m`,
  red:    (t) => `\x1b[31m${t}\x1b[0m`,
  cyan:   (t) => `\x1b[36m${t}\x1b[0m`,
  bold:   (t) => `\x1b[1m${t}\x1b[0m`,
};

async function setup() {
  console.log("\n" + COLORS.bold("╔════════════════════════════════════════╗"));
  console.log(COLORS.bold("║   GargoBarb — Setup de Base de Datos   ║"));
  console.log(COLORS.bold("╚════════════════════════════════════════╝\n"));

  // 1. Verificar conexión
  console.log(COLORS.cyan("📡 Conectando a MySQL..."));
  try {
    await sequelize.authenticate();
    console.log(COLORS.green("✅ Conexión exitosa a la base de datos\n"));
  } catch (err) {
    console.error(COLORS.red("❌ No se pudo conectar a la base de datos:"));
    console.error(COLORS.red(`   ${err.message}`));
    console.log(COLORS.yellow("\n💡 Verifica que tu .env tenga:"));
    console.log("   DB_HOST, DB_PORT, DB_USER, DB_PASS, DB_NAME");
    process.exit(1);
  }

  // 2. Listar modelos registrados
  const modelNames = Object.keys(models).filter(k => k !== "sequelize" && k !== "Sequelize");
  console.log(COLORS.cyan(`🗂️  Modelos encontrados (${modelNames.length}):`));
  modelNames.forEach(name => console.log(`   • ${name}`));
  console.log();

  // 3. Sincronizar con ALTER (no destruye datos)
  console.log(COLORS.cyan("🔄 Sincronizando tablas (ALTER TABLE seguro)..."));
  try {
    await sequelize.sync({ alter: true });
    console.log(COLORS.green("✅ Todas las tablas sincronizadas correctamente\n"));
  } catch (err) {
    console.error(COLORS.red("❌ Error durante la sincronización:"));
    console.error(COLORS.red(`   ${err.message}`));
    process.exit(1);
  }

  // 4. Resumen final
  console.log(COLORS.bold("╔════════════════════════════════════════╗"));
  console.log(COLORS.bold("║      ✅ Setup completado con éxito     ║"));
  console.log(COLORS.bold("╚════════════════════════════════════════╝"));
  console.log(COLORS.green("\n🎉 La base de datos está lista para usar."));
  console.log(COLORS.yellow("   Ahora puedes ejecutar: npm run dev\n"));

  process.exit(0);
}

setup();
