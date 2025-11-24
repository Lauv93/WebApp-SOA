/**
 * @swagger
 * tags:
 *   name: Appointments
 *   description: Gestión de citas veterinarias
 */

const express = require("express");
const router = express.Router();
const pool = require("../db");
const auth = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/isAdmin");

/**
 * @swagger
 * /api/appointments:
 *   post:
 *     summary: Crear una cita
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 */
router.post("/", auth, async (req, res) => {
  try {
    const { pet_id, date, reason } = req.body;

    if (req.user.role !== "admin") {
      const petCheck = await pool.query(
        "SELECT * FROM pets WHERE id = $1 AND user_id = $2",
        [pet_id, req.user.id]
      );

      if (petCheck.rows.length === 0)
        return res.status(403).json({ error: "No puedes crear citas para esta mascota" });
    }

    const result = await pool.query(
      `INSERT INTO appointments (pet_id ,user_id, date, reason, status)
       VALUES ($1, $2, $3, $4, 'Pendiente')
       RETURNING *`,
      [pet_id, req.user.id, date, reason]
    );

    res.status(201).json(result.rows[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});


router.get("/", auth, async (req, res) => {
  try {
    const result =
      req.user.role === "admin"
        ? await pool.query(
            `SELECT a.*, p.name AS pet_name, u.name AS owner 
             FROM appointments a
             JOIN pets p ON p.id = a.pet_id
             JOIN users u ON u.id = p.user_id
             ORDER BY date DESC`
          )
        : await pool.query(
            `SELECT a.*, p.name AS pet_name
             FROM appointments a
             JOIN pets p ON p.id = a.pet_id
             WHERE p.user_id = $1
             ORDER BY date DESC`,
            [req.user.id]
          );

    res.json(result.rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get("/:id", auth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT a.*, p.user_id 
       FROM appointments a
       JOIN pets p ON p.id = a.pet_id
       WHERE a.id = $1`,
      [req.params.id]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ error: "Cita no encontrada" });

    const appointment = result.rows[0];

    if (req.user.role !== "admin" && appointment.user_id !== req.user.id)
      return res.status(403).json({ error: "No puedes ver esta cita" });

    res.json(appointment);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});


router.patch("/:id", auth, async (req, res) => {
  try {
    const { date, reason } = req.body;

    const appt = await pool.query(
      `SELECT a.*, p.user_id
       FROM appointments a
       JOIN pets p ON p.id = a.pet_id
       WHERE a.id = $1`,
      [req.params.id]
    );

    if (appt.rows.length === 0)
      return res.status(404).json({ error: "Cita no encontrada" });

    const cita = appt.rows[0];

    // Usuario normal
    if (req.user.role !== "admin") {
      if (cita.user_id !== req.user.id)
        return res.status(403).json({ error: "No puedes modificar esta cita" });

      const solicitud = await pool.query(
        `UPDATE appointments
         SET status = 'Cambio Solicitado',
             date = COALESCE($1, date)
         WHERE id = $2
         RETURNING *`,
        [date, req.params.id]
      );

      return res.json({
        message: "Solicitud de cambio enviada al administrador",
        cita: solicitud.rows[0],
      });
    }

    // Admin
    const result = await pool.query(
      `UPDATE appointments
       SET date = COALESCE($1, date),
           reason = COALESCE($2, reason),
           status = 'Pendiente'
       WHERE id = $3
       RETURNING *`,
      [date, reason, req.params.id]
    );

    res.json({ message: "Cita actualizada por admin", cita: result.rows[0] });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});


router.delete("/:id", auth, isAdmin, async (req, res) => {
  try {
    await pool.query("DELETE FROM appointments WHERE id = $1", [
      req.params.id,
    ]);

    res.json({ message: "Cita eliminada por administrador" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});


module.exports = router;
