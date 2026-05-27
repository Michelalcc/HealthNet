const pool = require('../config/db');

// 🔍 FUNCIÓN CORRECTA (AQUÍ VA)
function detectarGenero(nombre) {

  const base = nombre
    .split(' ')[0]
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  const femeninos = [
    "adriana","maria","luisa","ana","sofia","valeria",
    "camila","daniela","paula","andrea","carla","lucia"
  ];

  if (femeninos.includes(base)) return "Femenino";

  if (base.endsWith("a")) return "Femenino";

  return "Masculino";
}

// 🎲 GENERAR DATOS (MODIFICADO)
function generarDatos(nombre) {
  return {
    edad: Math.floor(Math.random() * 60) + 20,
    genero: detectarGenero(nombre), // 🔥 AQUÍ CAMBIA
    enfermedades: 'Ninguna',
    alergias: 'Ninguna',
    imagen: nombre + '.jpg'
  };
}

// 🔥 BUSCAR O CREAR PACIENTE
exports.buscarOCrearPaciente = async (req, res) => {

  const { nombre } = req.params;

  try {

    const result = await pool.query(
      'SELECT * FROM pacientes WHERE LOWER(nombre)=LOWER($1)',
      [nombre]
    );

    if (result.rows.length > 0) {
      return res.json(result.rows[0]);
    }

    const d = generarDatos(nombre);

    const nuevo = await pool.query(
      `INSERT INTO pacientes 
      (nombre, edad, genero, enfermedades, alergias, imagen, doctor_id)
      VALUES ($1,$2,$3,$4,$5,$6,$7)
      RETURNING *`,
      [nombre, d.edad, d.genero, d.enfermedades, d.alergias, d.imagen, req.user.id]
    );

    res.json(nuevo.rows[0]);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 📋 LISTAR PACIENTES
exports.obtenerPacientes = async (req, res) => {
  try {

    const { hospital, doctor, genero } = req.query;

    let query = `
      SELECT p.*, d.nombre AS doctor_nombre
      FROM pacientes p
      LEFT JOIN doctores d ON d.id = p.doctor_id
      WHERE 1=1
    `;

    const params = [];

    if (hospital) {
      params.push(hospital);
      query += ` AND p.hospital = $${params.length}`;
    }

    if (doctor) {
      params.push(doctor);
      query += ` AND p.doctor_id = $${params.length}`;
    }

    if (genero) {
      params.push(genero);
      query += ` AND p.genero = $${params.length}`;
    }

    query += ` ORDER BY p.id DESC`;

    const result = await pool.query(query, params);

    res.json(result.rows);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};