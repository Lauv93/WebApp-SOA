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
    const { pet_id, diagnosis, weight, treatment, date } = req.body;

    // Buscamos la mascota
    const petRes = await pool.query("SELECT * FROM pets WHERE id = $1", [pet_id]);
    if (petRes.rows.length === 0) {
      return res.status(404).json({ error: "Mascota no encontrada" });
    }

    const pet = petRes.rows[0];

    // Insertamos el registro médico ligado al user_id de la mascota
    const result = await pool.query(
      `INSERT INTO medical_records (pet_id, user_id, diagnosis, weight, treatment, date)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [pet.id, pet.user_id, diagnosis, weight, treatment, date]
    );

    res.status(201).json(result.rows[0]);
  } catch (e) {
    console.error(e);
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
    let records;

    if (req.user.role === "admin") {
      // Admin ve todos los registros
      records = await pool.query(
        `SELECT mr.*, p.user_id 
         FROM medical_records mr
         JOIN pets p ON mr.pet_id = p.id
         ORDER BY mr.date DESC`
      );
    } else {
      // Usuario normal solo ve registros de sus mascotas
      records = await pool.query(
        `SELECT mr.*, p.user_id 
         FROM medical_records mr
         JOIN pets p ON mr.pet_id = p.id
         WHERE p.user_id = $1
         ORDER BY mr.date DESC`,
        [req.user.id]
      );
    }

    res.json(records.rows);
  } catch (e) {
    console.error(e);
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
    const { weight, diagnosis, treatment,date } = req.body;

    const record = await pool.query(
      "SELECT * FROM medical_records WHERE id = $1",
      [req.params.id]
    );

    if (record.rows.length === 0)
      return res.status(404).json({ error: "Registro no encontrado" });

    const updated = await pool.query(
      `UPDATE medical_records
       SET diagnosis = COALESCE($1, diagnosis),
           weight = COALESCE($2, weight),
           treatments = COALESCE($3, treatment),
           date = COALESCE($4, date)
       WHERE id = $5
       RETURNING *`,
      [diagnosis, weight, treatment, date, req.params.id]
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
