// FitnessApp Backend - Express Server
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { neon } = require('@neondatabase/serverless');
const { PrismaNeon } = require('@prisma/adapter-neon');
const { PrismaClient } = require('@prisma/client');

// Importar rutas
const authRoutes = require('./routes/auth');
const progresoRoutes = require('./routes/progreso');
const perfilRoutes = require('./routes/perfil');
const recomendacionesRoutes = require('./routes/recomendaciones');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Configurar Prisma con Neon
const connectionString = process.env.DATABASE_URL || '';
const sql = neon(connectionString);
const adapter = new PrismaNeon(sql);
const prisma = new PrismaClient({ adapter });

// Hacer prisma disponible globalmente
global.prisma = prisma;

// Rutas
app.use('/auth', authRoutes);
app.use('/progreso', progresoRoutes);
app.use('/perfil', perfilRoutes);
app.use('/recomendaciones', recomendacionesRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});

module.exports = app;
