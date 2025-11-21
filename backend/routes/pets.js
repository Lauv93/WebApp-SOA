/**
 * @swagger
 * tags:
 *   name: Pets
 *   description: Gestión de mascotas
 */

const express = require("express");
const router = express.Router();
const pool = require("../db");
const auth = require("../middleware/authMiddleware");

// Crear mascota
router.post("/", auth, async (req, res) => {
  try {
    const { name, type, breed, age } = req.body;

    const result = await pool.query(
      `INSERT INTO pets (user_id, name, type, breed, age)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [req.user.id, name, type, breed, age]
    );

    res.status(201).json(result.rows[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Obtener mis mascotas
router.get("/", auth, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM pets WHERE user_id = $1",
      [req.user.id]
    );
    res.json(result.rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Obtener mascota por ID
router.get("/:id", auth, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM pets WHERE id = $1 AND user_id = $2",
      [req.params.id, req.user.id]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ error: "Mascota no encontrada" });

    res.json(result.rows[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Editar mascota
router.patch("/:id", auth, async (req, res) => {
  try {
    const pet = await pool.query(
      "SELECT * FROM pets WHERE id = $1 AND user_id = $2",
      [req.params.id, req.user.id]
    );

    if (pet.rows.length === 0)
      return res.status(403).json({ error: "No puedes editar esta mascota" });

    const { name, type, breed, age } = req.body;

    const result = await pool.query(
      `UPDATE pets SET
        name = COALESCE($1, name),
        type = COALESCE($2, type),
        breed = COALESCE($3, breed),
        age = COALESCE($4, age)
      WHERE id = $5
      RETURNING *`,
      [name, type, breed, age, req.params.id]
    );

    res.json(result.rows[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Eliminar mascota (SOLO dueños)
router.delete("/:id", auth, async (req, res) => {
  try {
    const pet = await pool.query(
      "SELECT * FROM pets WHERE id = $1 AND user_id = $2",
      [req.params.id, req.user.id]
    );

    if (pet.rows.length === 0)
      return res.status(403).json({ error: "No puedes eliminar esta mascota" });

    await pool.query("DELETE FROM pets WHERE id = $1", [req.params.id]);

    res.json({ message: "Mascota eliminada" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
