const apiKey = '83d0f6ea0fmsh6e53a8b18000dd2p18a02fjsn2657937631d0';
const apiHost = 'weatherapi-com.p.rapidapi.com';
const micBtn = document.getElementById('micButton');
const micIcon = document.getElementById('micIcon');

async function getWeather(city) {
  city = city || document.getElementById("cityInput").value;
  if (!city) return;

  const weatherOutput = document.getElementById("weather-output");
  weatherOutput.innerHTML = `<h4 class="text-muted">Fetching weather for <strong>${city}</strong>...</h4>`;

  const url = `https://${apiHost}/forecast.json?q=${city}&days=3`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': apiKey,
        'X-RapidAPI-Host': apiHost
      }
    });

    const data = await response.json();
    const current = data.current;
    const location = data.location;
    const forecast = data.forecast.forecastday;

    updateBackground(current.condition.text);

    weatherOutput.innerHTML = `
      <h3>Weather in ${location.name}, ${location.country}</h3>
      <p>🌡️ Temp: ${current.temp_c}°C / ${current.temp_f}°F</p>
      <p>☁️ Condition: ${current.condition.text}</p>
      <p>🌬️ Wind Speed: ${current.wind_kph} km/h</p>
      <p>🌅 Sunrise: ${forecast[0].astro.sunrise}</p>
      <p>🌇 Sunset: ${forecast[0].astro.sunset}</p>
      <img src="${current.condition.icon}" alt="weather icon"/>
      <hr>
      <h5>Next 3 Days Forecast:</h5>
      ${forecast.map(day => `
        <p><strong>${day.date}:</strong> ${day.day.condition.text}, Max: ${day.day.maxtemp_c}°C, Min: ${day.day.mintemp_c}°C</p>
      `).join("")}
    `;
  } catch (err) {
    weatherOutput.innerHTML = `<p class="text-danger">Error fetching weather. Please try again!</p>`;
    console.error(err);
  }
}

function updateBackground(condition) {
  const hero = document.getElementById("hero-section");
  const lower = condition.toLowerCase();

  if (lower.includes("rain")) {
    hero.className = "hero rainy-bg";
  } else if (lower.includes("cloud")) {
    hero.className = "hero cloudy-bg";
  } else if (lower.includes("snow")) {
    hero.className = "hero snowy-bg";
  } else {
    hero.className = "hero sunny-bg";
  }
}

// Voice Input Setup
micBtn.addEventListener("click", () => {
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = 'en-US';
  recognition.start();

  micIcon.classList.add("mic-listening"); // Apply mic animation

  recognition.onresult = function (event) {
    const city = event.results[0][0].transcript;
    document.getElementById("cityInput").value = city;
    getWeather(city);
  };

  recognition.onend = function () {
    micIcon.classList.remove("mic-listening"); // Stop mic animation
  };
});
