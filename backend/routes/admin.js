/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Endpoints solo para administradores
 */
const express = require('express');
const router = express.Router();
const pool = require('../db');
const auth = require('../middleware/authMiddleware');
const isAdmin = require('../middleware/isAdmin');

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Listar todos los usuarios (solo admin)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200: { description: Lista de usuarios }
 */
router.get('/users', auth, isAdmin, async (req, res) => {
  const result = await pool.query('SELECT id, name, email, role, created_at FROM public.users');
  res.json(result.rows);
});

// Obtener todas las mascotas
router.get('/pets', auth, isAdmin, async (req, res) => {
  const result = await pool.query(
    `SELECT p.*, u.name AS owner, u.email AS owner_email
     FROM public.pets p
     JOIN public.users u ON u.id = p.user_id`
  );
  res.json(result.rows);
});

// Obtener todas las citas veterinarias
router.get('/appointments', auth, isAdmin, async (req, res) => {
  const result = await pool.query(
    `SELECT a.*, p.name AS pet_name, u.name AS owner_name
     FROM public.appointments a
     JOIN public.pets p ON p.id = a.pet_id
     JOIN public.users u ON u.id = a.user_id`
  );
  res.json(result.rows);
});

module.exports = router;
