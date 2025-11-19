/**
 * @swagger
 * tags:
 *   name: Reminders
 *   description: Recordatorios de mascotas
 */
const express = require('express');
const router = express.Router();
const pool = require('../db');
const auth = require('../middleware/authMiddleware');

/**
 * @swagger
 * /api/reminders:
 *   get:
 *     summary: Obtener recordatorios del usuario
 *     tags: [Reminders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200: { description: Lista de recordatorios }
 */
router.post('/', auth, async (req, res) => {
  try {
    const { pet_id, title, description, date } = req.body;

    // Validar que la mascota es del usuario
    const petCheck = await pool.query(
      'SELECT * FROM public.pets WHERE id = $1 AND user_id = $2',
      [pet_id, req.user.id]
    );

    if (petCheck.rows.length === 0)
      return res.status(403).json({ error: 'Mascota no pertenece al usuario' });

    const result = await pool.query(
      `INSERT INTO public.reminders (user_id, pet_id, title, description, date)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [req.user.id, pet_id, title, description, date]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error al crear recordatorio:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Listar recordatorios del usuario (todos)
router.get('/', auth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT r.*, p.name AS pet_name
       FROM public.reminders r
       JOIN public.pets p ON p.id = r.pet_id
       WHERE r.user_id = $1
       ORDER BY r.date`,
      [req.user.id]
    );

    res.json(result.rows);
  } catch (err) {
    console.error('Error al obtener recordatorios:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Listar recordatorios por mascota
router.get('/pet/:pet_id', auth, async (req, res) => {
  try {
    const { pet_id } = req.params;

    const petCheck = await pool.query(
      'SELECT * FROM public.pets WHERE id = $1 AND user_id = $2',
      [pet_id, req.user.id]
    );
    if (petCheck.rows.length === 0)
      return res.status(403).json({ error: 'Mascota no pertenece al usuario' });

    const result = await pool.query(
      `SELECT * FROM public.reminders
       WHERE pet_id = $1 AND user_id = $2
       ORDER BY date`,
      [pet_id, req.user.id]
    );

    res.json(result.rows);
  } catch (err) {
    console.error('Error al obtener recordatorios por mascota:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Eliminar recordatorio
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `DELETE FROM public.reminders
       WHERE id = $1 AND user_id = $2
       RETURNING *`,
      [id, req.user.id]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ error: 'Recordatorio no encontrado o no pertenece al usuario' });

    res.json({ message: 'Recordatorio eliminado' });
  } catch (err) {
    console.error('Error al borrar recordatorio:', err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
