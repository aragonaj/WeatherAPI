const fetch = require('node-fetch');

exports.getForecast = async (req, res) => {
  const { city, lat, lon } = req.query;
  const apiKey = process.env.WEATHER_API_KEY;
  const days = 14;

  try {
    let queryParam;

    if (lat && lon) {
      // Validación básica
      if (isNaN(lat) || isNaN(lon)) {
        return res.status(400).json({ error: 'Coordenadas inválidas' });
      }
      queryParam = `${lat},${lon}`;
    } else if (city) {
      queryParam = encodeURIComponent(city);
    } else {
      return res.status(400).json({ error: 'Debe proporcionar una ciudad o coordenadas' });
    }

    const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${queryParam}&days=${days}&aqi=no&alerts=no`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.error) {
      return res.status(400).json({ error: data.error.message });
    }

    res.json({
      city: data.location.name,
      country: data.location.country,
      forecast: data.forecast.forecastday.map(day => ({
        date: day.date,
        rain_mm: day.day.totalprecip_mm,
        rain_prob: day.day.daily_chance_of_rain,
        condition: day.day.condition.text,
      })),
    });
  } catch (error) {
    console.error('Error en getForecast:', error);
    res.status(500).json({ error: 'Error retrieving weather data' });
  }
};

// exports.getForecast = async (req, res) => {
//   const city = req.query.city || 'Madrid';
//   const apiKey = process.env.WEATHER_API_KEY;
//   const days = 14;

//   try {
//     const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${encodeURIComponent(city)}&days=${days}&aqi=no&alerts=no`;
//     const response = await fetch(url);
//     const data = await response.json();

//     if (data.error) {
//       return res.status(400).json({ error: data.error.message });
//     }

//     res.json({
//       city: data.location.name,
//       country: data.location.country,
//       forecast: data.forecast.forecastday.map(day => ({
//         date: day.date,
//         rain_mm: day.day.totalprecip_mm,
//         rain_prob: day.day.daily_chance_of_rain,
//         condition: day.day.condition.text,
//       })),
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Error retrieving weather data' });
//   }
// };