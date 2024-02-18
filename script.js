const apiKey = "90757b5d84eb4dcd944145853241702";
const apiBaseUrl = "https://api.weatherapi.com/v1/current.json";

document.getElementById('location-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const location = document.getElementById('location-input').value;
    if(location) {
        displayLoading(true);
        fetchWeather(location).then(weatherData => {
            console.log(weatherData);
            displayWeatherData(weatherData);
            displayLoading(false);
        }).catch(error => {
            console.error("Fetching weather data failed:", error);
            displayLoading(false);
        });
    }
});

async function fetchWeather(location) {
    const response = await fetch(`${apiBaseUrl}?key=${apiKey}&q=${encodeURIComponent(location)}`);
    if(!response.ok) {
        throw new Error('Failed to fetch weather data');
    }
    return await response.json();
}

function displayWeatherData(data) {
    const weatherElement = document.getElementById('weather-result');
    weatherElement.innerHTML = `Location: ${data.location.name}, ${data.location.country}<br>
                                Temperature: ${data.current.temp_c}°C<br>
                                Condition: ${data.current.condition.text}<img src=https:${data.current.condition.icon} alt="Weather Icon">`;
}

function displayLoading(show) {
    const loadingElement = document.getElementById('loading');
    loadingElement.style.display = show ? "block" : "none";
}

document.getElementById('get-location').addEventListener('click', function() {
    if(navigator.geolocation) {
        displayLoading(true);
        navigator.geolocation.getCurrentPosition(function(position) {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            fetchWeatherByCoords(lat, lon);
        }, function() {
            alert('Unable to retrieve your location');
            displayLoading(false);
        });
    } else {
        alert('Geolocation is not supported by this browser.');
    }
});

async function fetchWeatherByCoords(lat, lon) {
    try {
        const response = await fetch(`${apiBaseUrl}?key=${apiKey}&q=${lat},${lon}`);
        if(!response.ok) {
            throw new Error('Failed to fetch weather data');
        }
        const weatherData = await response.json();
        console.log(weatherData); 
        displayWeatherData(weatherData);
    } catch (error) {
        console.error("Fetching weather data failed:", error);
    } finally {
        displayLoading(false);
    }
}
