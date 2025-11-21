/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Endpoints solo para administradores
 */

const express = require("express");
const router = express.Router();
const pool = require("../db");
const auth = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/isAdmin");
 
/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Listar todos los usuarios (solo admin)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 */
router.get("/users", auth, isAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, name, email, role, created_at FROM public.users ORDER BY id"
    );
    res.json(result.rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

/**
 * @swagger
 * /api/admin/pets:
 *   get:
 *     summary: Listar todas las mascotas (solo admin)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 */
router.get("/pets", auth, isAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT p.*, u.name AS owner, u.email AS owner_email
       FROM public.pets p
       JOIN public.users u ON u.id = p.user_id
       ORDER BY p.id`
    );

    res.json(result.rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

/**
 * @swagger
 * /api/admin/appointments:
 *   get:
 *     summary: Listar todas las citas veterinarias (solo admin)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 */
router.get("/appointments", auth, isAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT a.*, 
              p.name AS pet_name,
              u.name AS owner_name,
              u.email AS owner_email
       FROM public.appointments a
       JOIN public.pets p ON p.id = a.pet_id
       JOIN public.users u ON u.id = p.user_id
       ORDER BY a.id`
    );

    res.json(result.rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});



module.exports = router;
