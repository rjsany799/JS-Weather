
const apiKey = "2789a50057128b51468d57393e8ab6b2"; 


const searchButton = document.getElementById("searchButton");
const currentLocationButton = document.getElementById("currentLocationButton");
const cityInput = document.getElementById("city");
const weatherInfo = document.getElementById("weatherInfo");
const forecast = document.getElementById("forecast");
const cityName = document.getElementById("cityName");
const currentDate = document.getElementById("currentDate");
const temperature = document.getElementById("temperature");
const windSpeed = document.getElementById("windSpeed");
const humidity = document.getElementById("humidity");
const weatherIcon = document.getElementById("weatherIcon");
const weatherDescription = document.getElementById("weatherDescription");
const forecastContainer = document.getElementById("forecastContainer");


const fetchWeatherData = async (url) => {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch weather data");
        return await response.json();
    } catch (error) {
        alert(error.message);
    }
};


const displayCurrentWeather = (data) => {
    cityName.textContent = `${data.name} (${new Date().toISOString().split('T')[0]})`;
    temperature.textContent = `Temperature: ${data.main.temp.toFixed(1)}°C`;
    windSpeed.textContent = `Wind: ${data.wind.speed} M/S`;
    humidity.textContent = `Humidity: ${data.main.humidity}%`;
    weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
    weatherDescription.textContent = data.weather[0].description;
    weatherInfo.classList.remove("hidden");
};




const displayForecast = (data) => {
    forecastContainer.innerHTML = "";
    const forecastData = data.list.filter((_, index) => index % 8 === 0);
    forecastData.forEach(day => {
        const card = document.createElement("div");
        card.className = "forecast-card";
        card.innerHTML = `
            <p>${day.dt_txt.split(" ")[0]}</p>
            <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}.png" alt="Weather Icon" class="mx-auto">
            <p>Temp: ${day.main.temp.toFixed(1)}°C</p>
            <p>Wind: ${day.wind.speed} M/S</p>
            <p>Humidity: ${day.main.humidity}%</p>
        `;
        forecastContainer.appendChild(card);
    });
    forecast.classList.remove("hidden");
};


const searchWeatherByCity = async () => {
    const city = cityInput.value.trim();
    if (!city) {
        alert("Please enter a city name.");
        return;
    }
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;
    const currentWeatherData = await fetchWeatherData(currentWeatherUrl);
    const forecastData = await fetchWeatherData(forecastUrl);
    if (currentWeatherData && forecastData) {
        displayCurrentWeather(currentWeatherData);
        displayForecast(forecastData);
    }
};


const searchWeatherByLocation = () => {
    navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;
        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;
        const currentWeatherData = await fetchWeatherData(currentWeatherUrl);
        const forecastData = await fetchWeatherData(forecastUrl);
        if (currentWeatherData && forecastData) {
            displayCurrentWeather(currentWeatherData);
            displayForecast(forecastData);
        }
    }, (error) => {
        alert("Failed to get current location.");
    });
};


searchButton.addEventListener("click", searchWeatherByCity);
currentLocationButton.addEventListener("click", searchWeatherByLocation);
