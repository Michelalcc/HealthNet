const express = require('express');
const router = express.Router();

const controller = require('../controllers/diagnosticoController');
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');

// 🔐 CREAR DIAGNÓSTICO
router.post('/', auth, role(["admin", "doctor", "especialista"]), controller.crearDiagnostico);

// 🔐 VER DIAGNÓSTICOS
router.get('/', auth, role(["admin", "doctor"]), controller.obtenerDiagnosticos);

// 🔐 EXPORTAR PDF INDIVIDUAL
router.get('/pdf/:id', auth, role(["admin", "doctor"]), controller.exportarPDF);

// 🔐 EXPORTAR PDF GENERAL
router.get('/pdf-general', auth, role(["admin"]), controller.exportarPDFGeneral);

module.exports = router;