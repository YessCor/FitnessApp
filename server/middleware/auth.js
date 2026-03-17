// Middleware de autenticación JWT
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'fitnessapp_secret_key_2024';

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Token de acceso requerido' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Token inválido o expirado' });
  }
};

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, nombre: user.nombre, apellido: user.apellido, email: user.email, username: user.username },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

module.exports = { authenticateToken, generateToken, JWT_SECRET };
