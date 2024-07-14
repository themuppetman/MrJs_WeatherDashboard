document.getElementById('location-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const city = document.getElementById('city').value.trim();

    // Check if button for the city already exists
    if (!document.getElementById(`save-btn-${city.toLowerCase()}`)) {
        createCityButton(city);
    } 

    // Fetch and display weather and forecast
    fetchWeatherAndForecast(city);
});

function createCityButton(city) {
    const buttonContainer = document.getElementById('location-form');
    const button = document.createElement('button');
    button.id = `save-btn-${city.toLowerCase()}`;
    button.classList.add('save-btn');
    // Save city to local storage
    const savedCities = JSON.parse(localStorage.getItem('savedCities')) || {};
    savedCities[city] = city;
    button.textContent = city;
    button.addEventListener('click', function () {
        fetchWeatherAndForecast(savedCities[city]);
    });
    buttonContainer.appendChild(button);
    // Do not add button if city is empty
    
}

function fetchWeatherAndForecast(city) {
    // Fetch weather data
    getWeather(city)
        .then(data => {
            displayWeather(data);
            saveWeatherData(data);
        })
        .catch(error => {
            console.error('Error fetching weather:', error);
            displayError('City not found. Please try again.');
        });

    // Fetch five-day forecast
    getForecast(city)
        .then(data => {
            displayForecast(data);
        })
        .catch(error => {
            console.error('Error fetching forecast:', error);
            displayError('Could not fetch forecast. Please try again.');
        });
}

function getWeather(city) {
    const apiKey = '9124784d854a241918add64bd859e008';
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`;

    return fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('City not found');
            }
            return response.json();
        });
}

function getForecast(city) {
    const apiKey = '9124784d854a241918add64bd859e008';
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=imperial`;

    return fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('City not found');
            }
            return response.json();
        });
}

function displayWeather(data) {
    const weatherDiv = document.getElementById('weather');
    const iconUrl = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    weatherDiv.innerHTML = `
        <h2>${data.name}</h2>
        <img src="${iconUrl}" alt="${data.weather[0].description}">
        <p>Temperature: ${data.main.temp}°F</p>
        <p>Weather: ${data.weather[0].main}</p>
        <p>Humidity: ${data.main.humidity}%</p>
        <p>Wind: ${data.wind.speed} mph</p>
    `;
}

function displayForecast(data) {
    const forecastDiv = document.querySelector('._5-day-box');
    forecastDiv.innerHTML = ''; // Clear previous forecast

    const forecastList = data.list.filter(item => item.dt_txt.includes("12:00:00")); // Filter for 12:00 PM forecasts

    forecastList.forEach(item => {
        const date = new Date(item.dt_txt).toLocaleDateString();
        const iconUrl = `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`;
        const temp = item.main.temp;

        const forecastItem = document.createElement('div');
        forecastItem.classList.add('forecast-item');
        forecastItem.innerHTML = `
            <h3>${date}</h3>
            <img src="${iconUrl}" alt="${item.weather[0].description}">
            <p>Temp: ${temp}°F</p>
            <p>Humidity: ${item.main.humidity}%</p>
            <p>Wind: ${item.wind.speed} mph</p>
            <p>${item.weather[0].main}</p>
        `;
        forecastDiv.appendChild(forecastItem);
    });
}

// Save weather data to local storage
function saveWeatherData(data) {
    localStorage.setItem('weatherData', JSON.stringify(data));
}

function displayError(message) {
    const weatherDiv = document.getElementById('weather');
    weatherDiv.innerHTML = `<p class="error">${message}</p>`;
}

