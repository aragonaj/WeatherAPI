async function search() {
  const city = document.getElementById('cityInput').value.trim();

  const lat = document.getElementById('lat').value.trim();
  const lon = document.getElementById('lon').value.trim();

  let query = '';
  if (lat && lon) {
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
      <h2 class="h2-title">Forecast for ${data.city}, ${data.country}</h2>
      <ul class="list">
        ${data.forecast.map(day => `
          <li class="list-item">
            <p class="description-text-condition">${day.date}: ${day.condition}</p>
            <p class="description-text-probability">${day.rain_mm} mm, probability ${day.rain_prob}%</p>
          </li>
          <hr class="hr">`).join('')}
      </ul>
    `;
  } catch (error) {
    document.getElementById('result').innerHTML = `<p>Error: ${error.message}</p>`;
    console.error('Error fetching forecast:', error);
  }
}

// Mapa
// iniciación del mapa 
const map = L.map('map').setView([40.4168, -3.7038], 6);

// Capa base de OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Evento para capturar clics en el mapa
map.on('click', function (e) {
  const lat = e.latlng.lat.toFixed(5);
  const lng = e.latlng.lng.toFixed(5);

  // Mostrar en inputs separados
  document.getElementById('lat').value = lat;
  document.getElementById('lon').value = lng;

  // Poner marcador
  L.marker([lat, lng]).addTo(map)
    .bindPopup(`Coordenadas:<br>${lat}, ${lng}`)
    .openPopup();
});

// Idioma
const translations = {
  es: {
    h2Title: "Precipitaciones",
    descriptionText1: "Consulta la previsión de lluvia de cualquier parte del mundo de los próximos 14 días",
    descriptionText2: "Puedes introducir el nombre de la ciudad, escribir directamente las coordenadas o hacer clic en el mapa para seleccionar una ubicación y buscar",
    descriptionText3: "Datos proporcionados por:",
    descriptionText4: "Mapa proporcionado por:",
    cityInput: "Introduzca una ciudad...",
    label1: "Latitud:",
    label2: "Longitud:",
    searchButton: "Buscar",
  },
  en: {
    h2Title: "Precipitation",
    descriptionText1: "Check the 14-day rainfall forecast for any location in the world",
    descriptionText2: "You can enter the city name, type the coordinates directly, or click on the map to select a location and search",
    descriptionText3: "Data provided by:",
    descriptionText4: "Map provided by:",
    cityInput: "Enter a city...",
    label1: "Latitude:",
    label2: "Longitude:",
    searchButton: "Search",
  }
};

let currentLang = 'es';

function applyTranslations(lang) {
  const t = translations[lang];

  document.getElementById('h2Title').textContent = t.h2Title;
  document.getElementById('descriptionText1').textContent = t.descriptionText1;
  document.getElementById('descriptionText2').textContent = t.descriptionText2;
  document.getElementById('descriptionText3').textContent = t.descriptionText3;
  document.getElementById('descriptionText4').textContent = t.descriptionText4;
  document.getElementById('cityInput').placeholder = t.cityInput;
  document.getElementById('label1').textContent = t.label1;
  document.getElementById('label2').textContent = t.label2;
  document.getElementById('searchButton').textContent = t.searchButton;

  document.getElementById('lang-toggle').textContent = lang === 'es' ? 'EN' : 'ES';
}

document.getElementById('lang-toggle').addEventListener('click', () => {
  currentLang = currentLang === 'es' ? 'en' : 'es';
  applyTranslations(currentLang);
});

document.addEventListener('DOMContentLoaded', () => {
  applyTranslations(currentLang);
});

// modo oscuro/modo claro
// cambiar de manera dinámica el icono
document.addEventListener("DOMContentLoaded", () => {
  const modeButton = document.getElementById("mode");
  const icon = modeButton.querySelector(".material-symbols-outlined");

  modeButton.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");

    const isDarkMode = document.body.classList.contains("dark-mode");
    icon.textContent = isDarkMode ? "clear_day" : "bedtime";
  });
});

// impedir que la API reciba la petición por cada input
// solo la recibirá por un input, el otro se encontrará deshabilitado
const cityInput = document.getElementById('cityInput');
const latInput = document.getElementById('lat');
const lonInput = document.getElementById('lon');

function toggleCoordInputs(disabled) {
  latInput.disabled = disabled;
  lonInput.disabled = disabled;
}

function toggleCityInput(disabled) {
  cityInput.disabled = disabled;
}

cityInput.addEventListener('input', () => {
  const isFilled = cityInput.value.trim() !== '';
  toggleCoordInputs(isFilled);
});

[latInput, lonInput].forEach(input => {
  input.addEventListener('input', () => {
    const isAnyCoordFilled = latInput.value.trim() !== '' || lonInput.value.trim() !== '';
    toggleCityInput(isAnyCoordFilled);
  });
});
