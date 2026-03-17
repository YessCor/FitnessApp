// Rutas de recomendaciones
const express = require('express');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Función para calcular IMC
const calcularIMC = (peso, estatura) => {
  // estatura en cm, convertir a metros
  const estaturaMetros = estatura / 100;
  return peso / (estaturaMetros * estaturaMetros);
};

// Función para obtener categoría de IMC
const obtenerCategoriaIMC = (imc) => {
  if (imc < 18.5) return 'bajo_peso';
  if (imc < 25) return 'normal';
  if (imc < 30) return 'sobrepeso';
  return 'obesidad';
};

// Función para obtener recomendaciones según categoría
const obtenerRecomendaciones = (categoria) => {
  const recomendaciones = {
    bajo_peso: {
      categoria: 'Bajo peso',
      recomendacion_entrenamiento: 'Entrenamiento de fuerza con pesas para ganar masa muscular. Entrena grupos musculares grandes 3-4 veces por semana.',
      recomendacion_nutricion: 'Incrementa tu consumo calórico con alimentos ricos en proteínas (carnes, huevos, legumbres) y carbohidratos complejos. Considera aumentar 300-500 kcal diarias.'
    },
    normal: {
      categoria: 'Peso normal',
      recomendacion_entrenamiento: 'Mantén un equilibrio entre entrenamiento de fuerza y cardio. 3-4 sesiones de fuerza + 2-3 sesiones de cardio semanales.',
     Recomendacion_nutricion: 'Mantén una dieta equilibrada con proteínas (1.6-2g por kg de peso), carbohidratos y grasas saludables. Hidratación adecuada.'
    },
    sobrepeso: {
      categoria: 'Sobrepeso',
      recomendacion_entrenamiento: 'Combina entrenamiento de fuerza con cardio moderado. Aumenta progresivamente la intensidad del cardio (30-45 min, 3-4 veces por semana).',
      recomendacion_nutricion: 'Crea un déficit calórico moderado (300-500 kcal menos). Prioriza proteínas y vegetales. Reduce azúcares y carbohidratos refinados.'
    },
    obesidad: {
      categoria: 'Obesidad',
      recomendacion_entrenamiento: 'Comienza con cardio de baja intensidad (caminar, natación). Gradually aumenta intensidad. Agrega entrenamiento de fuerza cuando mejore tu condición.',
      recomendacion_nutricion: 'Déficit calórico más agresivo (500-1000 kcal menos). Come más proteínas (2g por kg), muchas verduras, y evita processed foods. Consulta un nutritionist.'
    }
  };

  return recomendaciones[categoria];
};

// GET /recomendaciones - Obtener recomendaciones personalizadas
router.get('/', authenticateToken, async (req, res) => {
  try {
    const usuarioId = req.user.id;

    // Obtener perfil físico
    const perfil = await global.prisma.perfilFisico.findUnique({
      where: { usuarioId }
    });

    if (!perfil || !perfil.estatura) {
      return res.status(400).json({ 
        error: 'Perfil físico incompleto. Por favor completa tu peso y estatura.' 
      });
    }

    // Obtener fecha de nacimiento para calcular edad
    const usuario = await global.prisma.usuario.findUnique({
      where: { id: usuarioId },
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

    // Calcular IMC
    const peso = parseFloat(perfil.peso);
    const estatura = parseFloat(perfil.estatura);
    const imc = calcularIMC(peso, estatura);
    const categoria = obtenerCategoriaIMC(imc);
    const recomendaciones = obtenerRecomendaciones(categoria);

    res.json({
      imc: parseFloat(imc.toFixed(1)),
      categoria: recomendaciones.categoria,
      recomendacion_entrenamiento: recomendaciones.recomendacion_entrenamiento,
      recomendacion_nutricion: recomendaciones.recomendacion_nutricion,
      peso,
      estatura,
      edad,
      fecha_nacimiento: usuario?.fechaNacimiento
    });

  } catch (error) {
    console.error('Error al obtener recomendaciones:', error);
    res.status(500).json({ error: 'Error al generar recomendaciones' });
  }
});

module.exports = router;
