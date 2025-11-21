/**
 * @swagger
 * tags:
 *   name: Reminders
 *   description: Recordatorios para cuidados de mascotas
 */

const express = require("express");
const router = express.Router();
const pool = require("../db");
const auth = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/isAdmin");

/**
 * @swagger
 * /api/reminders:
 *   post:
 *     summary: Crear un recordatorio
 *     tags: [Reminders]
 *     security:
 *       - bearerAuth: []
 */
router.post("/", auth, async (req, res) => {
  try {
    const { pet_id, message, remind_at } = req.body;

    // Validar mascota si es usuario normal
    if (req.user.role !== "admin") {
      const pet = await pool.query(
        "SELECT * FROM pets WHERE id = $1 AND user_id = $2",
        [pet_id, req.user.id]
      );

      if (pet.rows.length === 0)
        return res.status(403).json({ error: "No puedes crear recordatorios para esta mascota" });
    }

    const result = await pool.query(
      `INSERT INTO reminders (pet_id, message, remind_at)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [pet_id, message, remind_at]
    );

    res.status(201).json(result.rows[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

/**
 * @swagger
 * /api/reminders:
 *   get:
 *     summary: Obtener recordatorios
 *     tags: [Reminders]
 *     security:
 *       - bearerAuth: []
 */
router.get("/", auth, async (req, res) => {
  try {
    let result;

    if (req.user.role === "admin") {
      result = await pool.query(
        `SELECT r.*, p.name AS pet_name, u.name AS owner
         FROM reminders r
         JOIN pets p ON p.id = r.pet_id
         JOIN users u ON p.user_id = u.id
         ORDER BY remind_at ASC`
      );
    } else {
      result = await pool.query(
        `SELECT r.*, p.name AS pet_name
         FROM reminders r
         JOIN pets p ON p.id = r.pet_id
         WHERE p.user_id = $1
         ORDER BY remind_at ASC`,
        [req.user.id]
      );
    }

    res.json(result.rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});


/**
 * @swagger
 * /api/reminders/{id}:
 *   get:
 *     summary: Obtener un recordatorio específico
 *     tags: [Reminders]
 *     security:
 *       - bearerAuth: []
 */
router.get("/:id", auth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT r.*, p.user_id
       FROM reminders r
       JOIN pets p ON p.id = r.pet_id
       WHERE r.id = $1`,
      [req.params.id]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ error: "Recordatorio no encontrado" });

    const reminder = result.rows[0];

    if (req.user.role !== "admin" && reminder.user_id !== req.user.id)
      return res.status(403).json({ error: "No tienes permiso para ver este recordatorio" });

    res.json(reminder);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});


/**
 * @swagger
 * /api/reminders/{id}:
 *   patch:
 *     summary: Actualizar un recordatorio
 *     tags: [Reminders]
 *     security:
 *       - bearerAuth: []
 */
router.patch("/:id", auth, async (req, res) => {
  try {
    const { message, remind_at } = req.body;

    // Validar permisos
    const reminder = await pool.query(
      `SELECT r.*, p.user_id
       FROM reminders r
       JOIN pets p ON p.id = r.pet_id
       WHERE r.id = $1`,
      [req.params.id]
    );

    if (reminder.rows.length === 0)
      return res.status(404).json({ error: "Recordatorio no encontrado" });

    const data = reminder.rows[0];

    if (req.user.role !== "admin" && data.user_id !== req.user.id)
      return res.status(403).json({ error: "No puedes modificar este recordatorio" });

    const updated = await pool.query(
      `UPDATE reminders
       SET message = COALESCE($1, message),
           remind_at = COALESCE($2, remind_at)
       WHERE id = $3
       RETURNING *`,
      [message, remind_at, req.params.id]
    );

    res.json({ message: "Recordatorio actualizado", reminder: updated.rows[0] });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

/**
 * @swagger
 * /api/reminders/{id}:
 *   delete:
 *     summary: Eliminar un recordatorio
 *     tags: [Reminders]
 *     security:
 *       - bearerAuth: []
 */
router.delete("/:id", auth, async (req, res) => {
  try {
    const reminder = await pool.query(
      `SELECT r.*, p.user_id
       FROM reminders r
       JOIN pets p ON p.id = r.pet_id
       WHERE r.id = $1`,
      [req.params.id]
    );

    if (reminder.rows.length === 0)
      return res.status(404).json({ error: "Recordatorio no encontrado" });

    const data = reminder.rows[0];

    if (req.user.role !== "admin" && data.user_id !== req.user.id)
      return res.status(403).json({ error: "No tienes permiso para eliminar este recordatorio" });

    await pool.query("DELETE FROM reminders WHERE id = $1", [req.params.id]);

    res.json({ message: "Recordatorio eliminado" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
