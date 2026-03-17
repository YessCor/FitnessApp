// Rutas de autenticación
const express = require('express');
const bcrypt = require('bcryptjs');
const { authenticateToken, generateToken } = require('../middleware/auth');

const router = express.Router();

// Registro de usuario
router.post('/register', async (req, res) => {
  try {
    const { nombre, apellido, email, username, password, fecha_nacimiento } = req.body;

    // Validar campos requeridos
    if (!nombre || !apellido || !email || !username || !password) {
      return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }

    // Verificar si el usuario ya existe
    const existingUser = await global.prisma.usuario.findFirst({
      where: {
        OR: [{ email }, { username }]
      }
    });

    if (existingUser) {
      return res.status(400).json({ 
        error: existingUser.email === email 
          ? 'El email ya está registrado' 
          : 'El username ya está en uso'
      });
    }

    // Hash de la contraseña
    const passwordHash = await bcrypt.hash(password, 10);

    // Crear usuario
    const usuario = await global.prisma.usuario.create({
      data: {
        nombre,
        apellido,
        email,
        username,
        passwordHash,
        fechaNacimiento: fecha_nacimiento ? new Date(fecha_nacimiento) : null,
        rol: 'usuario'
      },
      select: {
        id: true,
        nombre: true,
        apellido: true,
        email: true,
        username: true,
        fechaNacimiento: true,
        rol: true,
        createdAt: true
      }
    });

    res.status(201).json({ 
      message: 'Usuario registrado exitosamente',
      usuario
    });

  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
});

// Login de usuario
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña son requeridos' });
    }

    // Buscar usuario por email
    const usuario = await global.prisma.usuario.findUnique({
      where: { email }
    });

    if (!usuario) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Verificar contraseña
    const isValidPassword = await bcrypt.compare(password, usuario.passwordHash);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Generar token
    const token = generateToken(usuario);

    // Verificar si tiene perfil físico
    const perfilFisico = await global.prisma.perfilFisico.findUnique({
      where: { usuarioId: usuario.id }
    });

    res.json({
      message: 'Login exitoso',
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        email: usuario.email,
        username: usuario.username,
        fechaNacimiento: usuario.fechaNacimiento,
        rol: usuario.rol
      },
      tienePerfilFisico: !!perfilFisico
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
});

// Obtener datos del usuario actual
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const usuario = await global.prisma.usuario.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        nombre: true,
        apellido: true,
        email: true,
        username: true,
        fechaNacimiento: true,
        rol: true,
        createdAt: true
      }
    });

    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Verificar si tiene perfil físico
    const perfilFisico = await global.prisma.perfilFisico.findUnique({
      where: { usuarioId: usuario.id }
    });

    res.json({
      ...usuario,
      tienePerfilFisico: !!perfilFisico
    });

  } catch (error) {
    console.error('Error al obtener usuario:', error);
    res.status(500).json({ error: 'Error al obtener datos del usuario' });
  }
});

module.exports = router;
