const apiKey = "30f73c7c9dc7ab69923ee4a8a7d9d372"; // Replace with your OpenWeatherMap API key

// Fetches weather data based on user input and displays it
async function getWeather() {
  const cityInput = document.getElementById("cityInput");
  const city = encodeURIComponent(cityInput.value.trim());
  const resultDiv = document.getElementById("weatherResult");

  // Show error if input is empty
  if (city === "") {
    resultDiv.innerHTML = `<p style="color: red;">Please enter a city name.</p>`;
    return;
  }
   // Construct URL using API and city name
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  try {
    const response = await fetch(url);   //make API call
    const data = await response.json();  

    // Show error if city is invalid
    if (data.cod !== 200) {
      resultDiv.innerHTML = `<p style="color: red;">${data.message}</p>`;
      return;
    }

    displayWeather(data); 
  } catch (error) {
    resultDiv.innerHTML = `<p style="color: red;">Something went wrong. Please try again later.</p>`;
  }
}

//function to display the weather info
function displayWeather(data, locationNote = "") {
  const resultDiv = document.getElementById("weatherResult");

   // Show city name, icon, and weather details 
   resultDiv.innerHTML = `
    <h2>${data.name}, ${data.sys.country} ${locationNote}</h2>
    <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="Weather icon" />
    <div class="weather-info">
      <div><strong>Temperature:</strong></div><div>${data.main.temp}°C</div>
      <div><strong>Condition:</strong></div><div>${data.weather[0].description}</div>
      <div><strong>Humidity:</strong></div><div>${data.main.humidity}%</div>
      <div><strong>Wind Speed:</strong></div><div>${data.wind.speed} m/s</div>
    </div>
  `;
}
// Clears the weather result and input field
function clearWeather() {
  document.getElementById("weatherResult").innerHTML = "";
  document.getElementById("cityInput").value = "";
}

// Enable Enter key to trigger search
document.getElementById("cityInput").addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    getWeather();
  }
});

// Use browser Geolocation API to fetch weather automatically
window.addEventListener("load", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

        try {
          const response = await fetch(url);
          const data = await response.json();

          // Handle API errors
          if (data.cod !== 200) {
            document.getElementById("weatherResult").innerHTML = `<p style="color: red;">${data.message}</p>`;
            return;
          }
          // Show current location weather
          displayWeather(data, "(Your Location)");
        } catch (err) {
          document.getElementById("weatherResult").innerHTML = `<p style="color: red;">Failed to load weather for your location.</p>`;
        }
      },
      (error) => {
        console.warn("Geolocation blocked or failed:", error);
      }
    );
  } else {
    console.warn("Geolocation is not supported in this browser.");
  }
});
