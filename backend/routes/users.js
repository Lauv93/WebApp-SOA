/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Gestión de usuarios
 */


const express = require('express');
const router = express.Router();
const pool = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');



/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Registrar un nuevo usuario
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuario registrado correctamente
 */
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ error: 'Faltan campos obligatorios' });

   
    const existing = await pool.query('SELECT * FROM public.users WHERE email = $1', [email]);
    if (existing.rows.length > 0)
      return res.status(400).json({ error: 'El usuario ya existe' });

    
    const hash = await bcrypt.hash(password, 10);

    
    const result = await pool.query(
      'INSERT INTO public.users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email, created_at',
      [name, email, hash]
    );

    res.status(201).json({ user: result.rows[0] });
  } catch (err) {
  console.error('Error exacto al registrar usuario:', err);
  res.status(500).json({ error: err.message });
}

});


/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Iniciar sesión
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login exitoso
 */

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await pool.query('SELECT * FROM public.users WHERE email = $1', [email]);

    if (result.rows.length === 0)
      return res.status(400).json({ error: 'Usuario no encontrado' });

    const user = result.rows[0];
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match)
      return res.status(400).json({ error: 'Contraseña incorrecta' });

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role  }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.json({ message: 'Login exitoso', token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
});


/**
 * @swagger
 * /api/users/me:
 *   get:
 *     summary: Obtener datos del usuario autenticado (decodificando token)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Datos del usuario autenticado
 */
router.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'Token requerido' });

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const result = await pool.query('SELECT id, name, email, created_at FROM public.users WHERE id = $1', [decoded.id]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(401).json({ error: 'Token inválido o expirado' });
  }
});

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Ver perfil del usuario autenticado
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil del usuario
 */
const authMiddleware = require('../middleware/authMiddleware');

router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await pool.query(
      'SELECT id, name, email, created_at FROM public.users WHERE id = $1',
      [req.user.id]
    );
    if (user.rows.length === 0)
      return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(user.rows[0]);
  } catch (err) {
    console.error('Error en /profile:', err.message);
    res.status(500).json({ error: 'Error al obtener perfil' });
  }
});

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Obtener todos los usuarios (solo admin)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios
 */
router.get('/', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin")
      return res.status(403).json({ error: "Acceso denegado (solo administradores)" });

    const users = await pool.query(
      "SELECT id, name, email, role, created_at FROM public.users"
    );

    res.json(users.rows);

  } catch (err) {
    console.error("Error en GET /users:", err.message);
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
});

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Obtener un usuario por ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Datos del usuario
 */
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user.role !== "admin" && req.user.id !== parseInt(id))
      return res.status(403).json({ error: "No tienes permiso" });

    const result = await pool.query(
      "SELECT id, name, email, role, created_at FROM public.users WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ error: "Usuario no encontrado" });

    res.json(result.rows[0]);

  } catch (err) {
    console.error("Error en GET /users/:id:", err.message);
    res.status(500).json({ error: "Error al obtener usuario" });
  }
});

module.exports = router;