/**
 * @swagger
 * tags:
 *   name: Medical Records
 *   description: Historial médico de mascotas
 */
const express = require('express');
const router = express.Router();
const pool = require('../db');
const auth = require('../middleware/authMiddleware');

/**
 * @swagger
 * /api/medical-records:
 *   post:
 *     summary: Crear registro médico
 *     tags: [Medical Records]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201: { description: Registro creado }
 */
router.post('/', auth, async (req, res) => {
  try {
    const { pet_id, weight, diagnosis, treatment, date } = req.body;

    // Validar que la mascota pertenece al usuario
    const petCheck = await pool.query(
      'SELECT * FROM public.pets WHERE id = $1 AND user_id = $2',
      [pet_id, req.user.id]
    );

    if (petCheck.rows.length === 0)
      return res.status(403).json({ error: 'Mascota no pertenece al usuario' });

    const result = await pool.query(
      `INSERT INTO public.medical_records 
       (pet_id, user_id, weight, diagnosis, treatment, date)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [pet_id, req.user.id, weight, diagnosis, treatment, date]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error al crear registro médico:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Listar historial de una mascota (PROTEGIDO)
router.get('/:pet_id', auth, async (req, res) => {
  try {
    const petId = req.params.pet_id;

    // Validar mascota del usuario
    const petCheck = await pool.query(
      'SELECT * FROM public.pets WHERE id = $1 AND user_id = $2',
      [petId, req.user.id]
    );
    if (petCheck.rows.length === 0)
      return res.status(403).json({ error: 'Mascota no pertenece al usuario' });

    const result = await pool.query(
      `SELECT * FROM public.medical_records 
       WHERE pet_id = $1 AND user_id = $2
       ORDER BY date DESC`,
      [petId, req.user.id]
    );

    res.json(result.rows);
  } catch (err) {
    console.error('Error al obtener historial médico:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Eliminar registro médico (PROTEGIDO)
router.delete('/:id', auth, async (req, res) => {
  try {
    const recordId = req.params.id;

    const result = await pool.query(
      `DELETE FROM public.medical_records 
       WHERE id = $1 AND user_id = $2 
       RETURNING *`,
      [recordId, req.user.id]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ error: 'Registro no encontrado o no pertenece al usuario' });

    res.json({ message: 'Registro médico eliminado' });
  } catch (err) {
    console.error('Error al borrar registro médico:', err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
