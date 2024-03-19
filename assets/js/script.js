document.getElementById('location-form').addEventListener('submit', function(e) {
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
        });
});

function getWeather(city) {
    const apiKey = '02dcac2fc37c507c8f72bb6a0a01b040';
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

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
    weatherDiv.innerHTML = `
        <h2>${data.name}</h2>
        <p>
        <p>Temperature: ${data.main.temp}°F</p>
        <p>Weather: ${data.weather[0].main}</p>
    `;
}

function saveWeatherData(data) {
    localStorage.setItem('weatherData', JSON.stringify(data));
}
