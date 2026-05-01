// routes/distritoRoutes.js
// Definición de endpoints RESTful para la entidad Distrito

const express    = require('express');
const router     = express.Router();
const controller = require('../controllers/DistritoController');

// GET    /api/distritos          → Listar con paginación y búsqueda
// POST   /api/distritos          → Crear nuevo registro
// GET    /api/distritos/:id      → Obtener uno por ID
// PUT    /api/distritos/:id      → Actualizar por ID
// DELETE /api/distritos/:id      → Eliminar por ID

router.get   ('/',    controller.index);
router.post  ('/',    controller.store);
router.get   ('/:id', controller.show);
router.put   ('/:id', controller.update);
router.delete('/:id', controller.destroy);

module.exports = router;
