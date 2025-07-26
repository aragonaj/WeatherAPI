const required = ['PORT', 'WEATHER_API_KEY'];

required.forEach(name => {
  if (!process.env[name]) {
    throw new Error(`Falta variable de entorno: ${name}`);
  }
});

module.exports = {
  PORT: process.env.PORT,
  WEATHER_API_KEY: process.env.WEATHER_API_KEY
};