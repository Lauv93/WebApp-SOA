/**
 * @swagger
 * tags:
 *   name: MedicalRecords
 *   description: Historial médico de mascotas
 */

const express = require("express");
const router = express.Router();
const pool = require("../db");
const auth = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/isAdmin");

/**
 * @swagger
 * /api/medical-records:
 *   post:
 *     summary: Crear un registro médico para una mascota (solo admin)
 *     tags: [MedicalRecords]
 *     security:
 *       - bearerAuth: []
 */
router.post("/", auth, isAdmin, async (req, res) => {
  try {
    const { pet_id, description, treatment, date } = req.body;

    const petExists = await pool.query(
      "SELECT * FROM pets WHERE id = $1",
      [pet_id]
    );

    if (petExists.rows.length === 0)
      return res.status(404).json({ error: "Mascota no encontrada" });

    const result = await pool.query(
      `INSERT INTO medical_records (pet_id, description, treatment, date)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [pet_id, description, treatment, date]
    );

    res.status(201).json(result.rows[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});


/**
 * @swagger
 * /api/medical-records/pet/{pet_id}:
 *   get:
 *     summary: Obtener historial médico de una mascota
 *     tags: [MedicalRecords]
 *     security:
 *       - bearerAuth: []
 */
router.get("/pet/:pet_id", auth, async (req, res) => {
  try {
    const { pet_id } = req.params;

    const pet = await pool.query(
      "SELECT * FROM pets WHERE id = $1",
      [pet_id]
    );

    if (pet.rows.length === 0)
      return res.status(404).json({ error: "Mascota no encontrada" });

    if (req.user.role !== "admin" && pet.rows[0].user_id !== req.user.id)
      return res.status(403).json({ error: "No tienes permiso para ver este historial" });

    const records = await pool.query(
      "SELECT * FROM medical_records WHERE pet_id = $1 ORDER BY date DESC",
      [pet_id]
    );

    res.json(records.rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

/**
 * @swagger
 * /api/medical-records/{id}:
 *   get:
 *     summary: Ver un registro médico por ID
 *     tags: [MedicalRecords]
 *     security:
 *       - bearerAuth: []
 */
router.get("/:id", auth, async (req, res) => {
  try {
    const record = await pool.query(
      `SELECT mr.*, p.user_id
       FROM medical_records mr
       JOIN pets p ON p.id = mr.pet_id
       WHERE mr.id = $1`,
      [req.params.id]
    );

    if (record.rows.length === 0)
      return res.status(404).json({ error: "Registro no encontrado" });

    const data = record.rows[0];

    if (req.user.role !== "admin" && data.user_id !== req.user.id)
      return res.status(403).json({ error: "No tienes permiso para ver este registro" });

    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});


/**
 * @swagger
 * /api/medical-records/{id}:
 *   patch:
 *     summary: Actualizar un registro médico (solo admin)
 *     tags: [MedicalRecords]
 *     security:
 *       - bearerAuth: []
 */
router.patch("/:id", auth, isAdmin, async (req, res) => {
  try {
    const { description, treatment, date } = req.body;

    const record = await pool.query(
      "SELECT * FROM medical_records WHERE id = $1",
      [req.params.id]
    );

    if (record.rows.length === 0)
      return res.status(404).json({ error: "Registro no encontrado" });

    const updated = await pool.query(
      `UPDATE medical_records
       SET description = COALESCE($1, description),
           treatment = COALESCE($2, treatment),
           date = COALESCE($3, date)
       WHERE id = $4
       RETURNING *`,
      [description, treatment, date, req.params.id]
    );

    res.json({ message: "Registro actualizado", record: updated.rows[0] });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

/**
 * @swagger
 * /api/medical-records/{id}:
 *   delete:
 *     summary: Eliminar un registro médico (solo admin)
 *     tags: [MedicalRecords]
 *     security:
 *       - bearerAuth: []
 */
router.delete("/:id", auth, isAdmin, async (req, res) => {
  try {
    const record = await pool.query(
      "SELECT * FROM medical_records WHERE id = $1",
      [req.params.id]
    );

    if (record.rows.length === 0)
      return res.status(404).json({ error: "Registro no encontrado" });

    await pool.query("DELETE FROM medical_records WHERE id = $1", [
      req.params.id,
    ]);

    res.json({ message: "Registro eliminado correctamente" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});


module.exports = router;
