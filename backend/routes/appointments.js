/**
 * @swagger
 * tags:
 *   name: Appointments
 *   description: Citas veterinarias
 */
const express = require('express');
const router = express.Router();
const pool = require('../db');
const auth = require('../middleware/authMiddleware');

/**
 * @swagger
 * /api/appointments:
 *   post:
 *     summary: Crear cita
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Cita creada
 */
router.post('/', auth, async (req, res) => {
  try {
    const { pet_id, date, reason } = req.body;

    // Validar que esa mascota pertenece al usuario
    const petCheck = await pool.query(
      'SELECT * FROM public.pets WHERE id = $1 AND user_id = $2',
      [pet_id, req.user.id]
    );

    if (petCheck.rows.length === 0)
      return res.status(403).json({ error: 'Esta mascota no te pertenece' });

    const result = await pool.query(
      `INSERT INTO public.appointments (user_id, pet_id, date, reason)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [req.user.id, pet_id, date, reason]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error al crear cita:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Listar citas del usuario (PROTEGIDO)
router.get('/', auth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT a.*, p.name AS pet_name
       FROM public.appointments a
       JOIN public.pets p ON p.id = a.pet_id
       WHERE a.user_id = $1
       ORDER BY a.date`,
      [req.user.id]
    );

    res.json(result.rows);
  } catch (err) {
    console.error('Error al obtener citas:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Eliminar cita (PROTEGIDO)
router.delete('/:id', auth, async (req, res) => {
  try {
    const appointmentId = req.params.id;

    const result = await pool.query(
      `DELETE FROM public.appointments
       WHERE id = $1 AND user_id = $2
       RETURNING *`,
      [appointmentId, req.user.id]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ error: 'Cita no encontrada o no te pertenece' });

    res.json({ message: 'Cita cancelada' });
  } catch (err) {
    console.error('Error al borrar cita:', err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
