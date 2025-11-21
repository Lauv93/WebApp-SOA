
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const usersRoutes = require('./routes/users');
const app = express();
const petsRoutes = require('./routes/pets');
const appointmentsRoutes = require('./routes/appointments');
const medicalRecordsRoutes = require('./routes/medicalRecords');
const remindersRoutes = require('./routes/reminders');
const adminRoutes = require('./routes/admin');
const { swaggerUi, swaggerSpec } = require('./swagger');

app.use(cors());
app.use(express.json());

app.use('/api/appointments', appointmentsRoutes);
app.use('/api/pets', petsRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/medical-records', medicalRecordsRoutes);
app.use('/api/reminders', remindersRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});


app.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ message: 'Conectado a Neon!', time: result.rows[0].now });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al conectar con Neon' });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
