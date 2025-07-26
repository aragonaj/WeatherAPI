// config/env.config.js
const requiredEnvVars = ['PORT', 'WEATHER_API_KEY'];

requiredEnvVars.forEach((varName) => {
  if (!process.env[varName]) {
    throw new Error(`Falta la variable de entorno obligatoria: ${varName}`);
  }
});

module.exports = {
  PORT: process.env.PORT,
  WEATHER_API_KEY: process.env.WEATHER_API_KEY,
};