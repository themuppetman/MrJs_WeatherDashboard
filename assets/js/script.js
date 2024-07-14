document.getElementById('location-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const city = document.getElementById('city').value;

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

   

});



function getWeather(city) {
    const apiKey = '9124784d854a241918add64bd859e008';
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

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
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

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
            <p>Temp: ${temp}°C</p>
            <p>${item.weather[0].main}</p>
        `;
        forecastDiv.appendChild(forecastItem);
    });
}

// Save weather data to local storage
function saveWeatherData(data) {
    localStorage.setItem('weatherData', JSON.stringify(data));
}
// Display saved cities in location-form


function displayError(message) {
    const weatherDiv = document.getElementById('weather');
    weatherDiv.innerHTML = `<p class="error">${message}</p>`;
}
