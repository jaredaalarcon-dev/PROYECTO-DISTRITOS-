// server.js
// Punto de entrada del servidor Express

require('dotenv').config();
const express         = require('express');
const cors            = require('cors');
const distritoRoutes  = require('./routes/distritoRoutes');

const app  = express();
const PORT = process.env.PORT || 3000;

// ── Middlewares globales ───────────────────────────────────────────────────
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'], // Vite dev server
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Rutas ──────────────────────────────────────────────────────────────────
app.use('/api/distritos', distritoRoutes);

// Ruta de salud del servidor
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Manejador de rutas no encontradas
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Ruta no encontrada.' });
});

// Manejador global de errores
app.use((err, _req, res, _next) => {
  console.error('Error no controlado:', err);
  res.status(500).json({ success: false, message: 'Error interno del servidor.' });
});

// ── Iniciar servidor ───────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📋 API: http://localhost:${PORT}/api/distritos`);
});
