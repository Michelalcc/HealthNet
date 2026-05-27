const pool = require("../config/db");

const getDashboard = async (req, res) => {
  try {
    const hospitalId = req.user.hospital_id;
    const rol = req.user.rol;

    const isAdmin = rol === "admin";

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

const pacientes = isAdmin
  ? await pool.query("SELECT COUNT(*) FROM pacientes")
  : await pool.query(
      "SELECT COUNT(*) FROM pacientes WHERE hospital_id = $1",
      [hospitalId]
    );

    // 🧠 DIAGNÓSTICOS HOY (más seguro)
const diagnosticos = isAdmin
  ? await pool.query(
      `SELECT COUNT(*) FROM diagnosticos WHERE DATE(fecha) = CURRENT_DATE`
    )
  : await pool.query(
      `SELECT COUNT(*) 
       FROM diagnosticos 
       WHERE DATE(fecha) = CURRENT_DATE
       AND hospital_id = $1`,
      [hospitalId]
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