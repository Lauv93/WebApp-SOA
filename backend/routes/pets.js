/**
 * @swagger
 * tags:
 *   name: Pets
 *   description: Gestión de mascotas
 */


const express = require('express');
const router = express.Router();
const pool = require('../db');
const authMiddleware = require('../middleware/authMiddleware');

/**
 * @swagger
 * /api/pets:
 *   post:
 *     summary: Crear una mascota
 *     tags: [Pets]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               age: { type: integer }
 *               type: { type: string }
 *               breed: { type: string }
 *     responses:
 *       201:
 *         description: Mascota creada
 */
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, type, age } = req.body;

    const result = await pool.query(
      `INSERT INTO public.pets (user_id, name, type, age)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [req.user.id, name, type, age]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error al crear mascota:', err.message);
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/pets:
 *   get:
 *     summary: Obtener mascotas del usuario
 *     tags: [Pets]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200: { description: Lista de mascotas }
 */
router.get('/', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM public.pets WHERE user_id = $1 ORDER BY created_at DESC`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error al obtener mascotas:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Eliminar mascota (PROTEGIDO)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const petId = req.params.id;

    const result = await pool.query(
      `DELETE FROM public.pets
       WHERE id = $1 AND user_id = $2
       RETURNING *`,
      [petId, req.user.id]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ error: 'Mascota no encontrada o no te pertenece' });

    res.json({ message: 'Mascota eliminada' });
  } catch (err) {
    console.error('Error al borrar mascota:', err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
