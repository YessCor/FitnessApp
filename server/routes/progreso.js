// Rutas de progreso
const express = require('express');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// GET /progreso - Obtener historial de progreso del usuario autenticado
router.get('/', authenticateToken, async (req, res) => {
  try {
    const progresos = await global.prisma.progreso.findMany({
      where: { usuarioId: req.user.id },
      orderBy: { fecha: 'desc' },
      select: {
        id: true,
        peso: true,
        estatura: true,
        fecha: true,
        notas: true
      }
    });

    // Convertir Decimal a número para compatibilidad con frontend
    const formattedProgresos = progresos.map(p => ({
      id: p.id,
      peso: parseFloat(p.peso),
      estatura: p.estatura ? parseFloat(p.estatura) : null,
      fecha: p.fecha.toISOString().split('T')[0],
      notas: p.notas
    }));

    res.json(formattedProgresos);

  } catch (error) {
    console.error('Error al obtener progreso:', error);
    res.status(500).json({ error: 'Error al obtener historial de progreso' });
  }
});

// POST /progreso - Agregar nuevo registro de progreso
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { peso, estatura, notas } = req.body;
    const usuarioId = req.user.id;

    if (!peso) {
      return res.status(400).json({ error: 'El peso es requerido' });
    }

    const fecha = new Date();

    // Crear nuevo registro de progreso
    const nuevoProgreso = await global.prisma.progreso.create({
      data: {
        usuarioId,
        peso: parseFloat(peso),
        estatura: estatura ? parseFloat(estatura) : null,
        fecha,
        notas: notas || null
      },
      select: {
        id: true,
        peso: true,
        estatura: true,
        fecha: true,
        notas: true
      }
    });

    // Sincronizar con perfil_fisico - actualizar peso y estatura
    const perfilExistente = await global.prisma.perfilFisico.findUnique({
      where: { usuarioId }
    });

    if (perfilExistente) {
      // Actualizar perfil físico con los nuevos valores
      await global.prisma.perfilFisico.update({
        where: { usuarioId },
        data: {
          peso: parseFloat(peso),
          ...(estatura && { estatura: parseFloat(estatura) })
        }
      });
    }

    // Responder con formato compatible
    res.status(201).json({
      id: nuevoProgreso.id,
      peso: parseFloat(nuevoProgreso.peso),
      estatura: nuevoProgreso.estatura ? parseFloat(nuevoProgreso.estatura) : null,
      fecha: nuevoProgreso.fecha.toISOString().split('T')[0],
      notas: nuevoProgreso.notas,
      message: 'Progreso registrado exitosamente'
    });

  } catch (error) {
    console.error('Error al registrar progreso:', error);
    res.status(500).json({ error: 'Error al registrar progreso' });
  }
});

// DELETE /progreso/:id - Eliminar un registro de progreso
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const usuarioId = req.user.id;

    // Verificar que el progreso pertenece al usuario
    const progreso = await global.prisma.progreso.findFirst({
      where: {
        id: parseInt(id),
        usuarioId
      }
    });

    if (!progreso) {
      return res.status(404).json({ error: 'Registro de progreso no encontrado' });
    }

    await global.prisma.progreso.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: 'Progreso eliminado exitosamente' });

  } catch (error) {
    console.error('Error al eliminar progreso:', error);
    res.status(500).json({ error: 'Error al eliminar progreso' });
  }
});

module.exports = router;
