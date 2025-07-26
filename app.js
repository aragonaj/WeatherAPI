// requerimientos/importaciones
require('dotenv').config(); // Cargar variables de entorno desde .env
const express = require('express');
const path = require('path');
const weatherRoutes = require('./app_server/routes/weatherRoutes');
const { PORT } = require('./config/env.config');

const app = express();

// Middlewares
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Rutas API
app.use('/api/weather', weatherRoutes);


// HTML de inicio
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});