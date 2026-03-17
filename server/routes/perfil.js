// Rutas de perfil físico
const express = require('express');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// GET /perfil - Obtener perfil físico del usuario
router.get('/', authenticateToken, async (req, res) => {
  try {
    const perfil = await global.prisma.perfilFisico.findUnique({
      where: { usuarioId: req.user.id },
      select: {
        id: true,
        peso: true,
        estatura: true,
        createdAt: true
      }
    });

    if (!perfil) {
      return res.status(404).json({ error: 'Perfil físico no encontrado' });
    }

    // Obtener datos del usuario para fecha de nacimiento
    const usuario = await global.prisma.usuario.findUnique({
      where: { id: req.user.id },
      select: { fechaNacimiento: true }
    });

    // Calcular edad
    let edad = null;
    if (usuario?.fechaNacimiento) {
      const today = new Date();
      const birthDate = new Date(usuario.fechaNacimiento);
      edad = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        edad--;
      }
    }

    res.json({
      id: perfil.id,
      peso: parseFloat(perfil.peso),
      estatura: perfil.estatura ? parseFloat(perfil.estatura) : null,
      createdAt: perfil.createdAt,
      edad
    });

  } catch (error) {
    console.error('Error al obtener perfil:', error);
    res.status(500).json({ error: 'Error al obtener perfil físico' });
  }
});

// POST /perfil - Crear perfil físico (obligatorio tras registro)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { peso, estatura } = req.body;
    const usuarioId = req.user.id;

    if (!peso || !estatura) {
      return res.status(400).json({ error: 'Peso y estatura son requeridos' });
    }

    // Verificar si ya existe perfil
    const perfilExistente = await global.prisma.perfilFisico.findUnique({
      where: { usuarioId }
    });

    if (perfilExistente) {
      return res.status(400).json({ error: 'El perfil físico ya existe. Usa PUT para actualizar.' });
    }

    // Crear perfil físico
    const perfil = await global.prisma.perfilFisico.create({
      data: {
        usuarioId,
        peso: parseFloat(peso),
        estatura: parseFloat(estatura)
      },
      select: {
        id: true,
        peso: true,
        estatura: true,
        createdAt: true
      }
    });

    // Crear automáticamente primer registro en progreso
    await global.prisma.progreso.create({
      data: {
        usuarioId,
        peso: parseFloat(peso),
        estatura: parseFloat(estatura),
        fecha: new Date(),
        notas: 'Registro inicial de peso'
      }
    });

    res.status(201).json({
      id: perfil.id,
      peso: parseFloat(perfil.peso),
      estatura: parseFloat(perfil.estatura),
      createdAt: perfil.createdAt,
      message: 'Perfil físico creado exitosamente'
    });

  } catch (error) {
    console.error('Error al crear perfil:', error);
    res.status(500).json({ error: 'Error al crear perfil físico' });
  }
});

// PUT /perfil - Actualizar perfil físico
router.put('/', authenticateToken, async (req, res) => {
  try {
    const { peso, estatura } = req.body;
    const usuarioId = req.user.id;

    const perfilExistente = await global.prisma.perfilFisico.findUnique({
      where: { usuarioId }
    });

    if (!perfilExistente) {
      return res.status(404).json({ error: 'Perfil físico no encontrado' });
    }

    const perfil = await global.prisma.perfilFisico.update({
      where: { usuarioId },
      data: {
        ...(peso && { peso: parseFloat(peso) }),
        ...(estatura && { estatura: parseFloat(estatura) })
      },
      select: {
        id: true,
        peso: true,
        estatura: true,
        createdAt: true
      }
    });

    res.json({
      id: perfil.id,
      peso: parseFloat(perfil.peso),
      estatura: perfil.estatura ? parseFloat(perfil.estatura) : null,
      createdAt: perfil.createdAt,
      message: 'Perfil físico actualizado exitosamente'
    });

  } catch (error) {
    console.error('Error al actualizar perfil:', error);
    res.status(500).json({ error: 'Error al actualizar perfil físico' });
  }
});

module.exports = router;
