async function search() {
  const city = document.getElementById('city').value;

  // añadido
  const lat = document.getElementById('lat').value.trim();
  const lon = document.getElementById('lon').value.trim();

  let query = '';
  if (lat && lon) {
    // Validación simple
    if (isNaN(lat) || isNaN(lon)) {
      document.getElementById('result').innerHTML = '<p>Error: Coordenadas inválidas.</p>';
      return;
    }
    query = `lat=${lat}&lon=${lon}`;
  } else if (city) {
    query = `city=${encodeURIComponent(city)}`;
  } else {
    document.getElementById('result').innerHTML = '<p>Error: Introduce una ciudad o coordenadas.</p>';
    return;
  }

  try {
    const res = await fetch(`/api/weather?${query}`);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

    const data = await res.json();

    if (!data.forecast || !Array.isArray(data.forecast)) {
      throw new Error('Forecast data is missing or invalid');
    }

    const div = document.getElementById('result');
    div.innerHTML = `
      <h2>Forecast for ${data.city}, ${data.country}</h2>
      <ul>
        ${data.forecast.map(day => `
          <li>${day.date}: ${day.condition}, ${day.rain_mm} mm, probability ${day.rain_prob}%</li>
        `).join('')}
      </ul>
    `;
  } catch (error) {
    document.getElementById('result').innerHTML = `<p>Error: ${error.message}</p>`;
    console.error('Error fetching forecast:', error);
  }

  // try {
  //   const res = await fetch(`/api/weather?city=${city}`);
  //   if (!res.ok) {
  //     throw new Error(`HTTP error! status: ${res.status}`);
  //   }
  //   const data = await res.json();

  //   if (!data.forecast || !Array.isArray(data.forecast)) {
  //     throw new Error('Forecast data is missing or invalid');
  //   }

  //   const div = document.getElementById('result');
  //   div.innerHTML = `
  //     <h2>Forecast for ${data.city}, ${data.country}</h2>
  //     <ul>
  //       ${data.forecast.map(day => `
  //         <li>${day.date}: ${day.condition}, ${day.rain_mm} mm, probability ${day.rain_prob}%</li>
  //       `).join('')}
  //     </ul>
  //   `;
  // } catch (error) {
  //   document.getElementById('result').innerHTML = `<p>Error: ${error.message}</p>`;
  //   console.error('Error fetching forecast:', error);
  // }
}