const pool = require("../config/db");

const getDashboard = async (req, res) => {
  try {
    const hospitalId = req.user.hospital_id;
    const rol = req.user.rol;

    // 🔥 VALIDACIÓN IMPORTANTE
    if (!hospitalId) {
      return res.json({
        totalPacientes: 0,
        diagnosticosHoy: 0,
        rol,
        warning: "Usuario sin hospital asignado"
      });
    }

// =========================
// 🔢 PACIENTES (ADMIN GLOBAL + HOSPITAL)
// =========================
const hospitalFilter = hospitalId ? "WHERE hospital_id = $1" : "";
const params = hospitalId ? [hospitalId] : [];

const pacientes = await pool.query(
  `SELECT COUNT(*) FROM pacientes ${hospitalFilter}`,
  params
);

    // 🧠 DIAGNÓSTICOS HOY (más seguro)
const diagnosticos = await pool.query(
  hospitalId
    ? `SELECT COUNT(*) FROM diagnosticos WHERE hospital_id = $1`
    : `SELECT COUNT(*) FROM diagnosticos`,
  hospitalId ? [hospitalId] : []
);

    res.json({
      totalPacientes: parseInt(pacientes.rows[0].count),
      diagnosticosHoy: parseInt(diagnosticos.rows[0].count),
      rol
    });

  } catch (error) {
    console.error("❌ DASHBOARD ERROR:", error.message);

    res.status(500).json({
      message: "Error dashboard",
      error: error.message // 🔥 clave para debug
    });
  }
};

module.exports = { getDashboard };