const express = require('express');
const router = express.Router();

const controller = require('../controllers/pacienteController');
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');

// 🔐 TODOS LOS USUARIOS LOGUEADOS
router.get('/auto/:nombre', auth, role(["admin", "doctor", "especialista"]), controller.buscarOCrearPaciente);

// 🔐 LISTADO SOLO ROLES MÉDICOS
router.get('/', auth, role(["admin", "doctor", "especialista"]), controller.obtenerPacientes);

module.exports = router;