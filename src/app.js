// --- CONFIGURATION ---
const API_KEY = import.meta.env.VITE_API_KEY;
const JAKARTA_COORDS = { lat: -6.2088, lon: 106.8456 };
const API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${JAKARTA_COORDS.lat}&lon=${JAKARTA_COORDS.lon}&appid=${API_KEY}&units=metric`;

// --- DOM ELEMENTS ---
const forecastContainer = document.getElementById('forecast-container');
const errorContainer = document.getElementById('error-container');
const errorMessageElement = document.getElementById('error-message');
const lastUpdatedElement = document.getElementById('last-updated');
const currentDatetimeElement = document.getElementById('current-datetime');
const refreshBtn = document.getElementById('refresh-btn');

// --- CORE LOGIC ---

/**
 * Fetches weather data from the OpenWeatherMap API.
 * @returns {Promise<Object>} The weather forecast data.
 */
const fetchWeatherData = async () => {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error(`API request failed: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching weather data:", error);
        throw error;
    }
};

/**
 * Groups forecast list by day.
 * @param {Array} forecastList - The list of forecasts from the API.
 * @returns {Object} An object with dates as keys and forecast arrays as values.
 */
const groupForecastByDay = (forecastList) => {
    return forecastList.reduce((acc, forecast) => {
        const date = forecast.dt_txt.split(' ')[0];
        if (!acc[date]) {
            acc[date] = [];
        }
        acc[date].push(forecast);
        return acc;
    }, {});
};

/**
 * Selects a single representative temperature for each day.
 * Prefers the forecast closest to 12:00 PM.
 * @param {Object} groupedForecasts - Forecasts grouped by day.
 * @returns {Array} A list of selected daily forecasts.
 */
const selectDailyTemperature = (groupedForecasts) => {
    return Object.values(groupedForecasts).map(dayForecasts => {
        // Find the forecast closest to noon (12:00)
        let closestToNoon = dayForecasts[0];
        let minDiff = Infinity;

        dayForecasts.forEach(forecast => {
            const hour = new Date(forecast.dt * 1000).getHours();
            const diff = Math.abs(hour - 12);
            if (diff < minDiff) {
                minDiff = diff;
                closestToNoon = forecast;
            }
        });
        return closestToNoon;
    }).slice(0, 5); // Ensure we only have 5 days
};

// --- UI RENDERING ---

/**
 * Renders the weather forecast cards.
 * @param {Array} dailyForecasts - The list of selected daily forecasts.
 */
const renderForecast = (dailyForecasts) => {
    forecastContainer.innerHTML = ''; // Clear skeleton or old data
    dailyForecasts.forEach(forecast => {
        const card = createForecastCard(forecast);
        forecastContainer.appendChild(card);
    });
};

/**
 * Creates a single forecast card element.
 * @param {Object} forecast - The forecast data for one day.
 * @returns {HTMLElement} The created card element.
 */
const createForecastCard = (forecast) => {
    const card = document.createElement('div');
    card.className = 'card';

    const date = new Date(forecast.dt * 1000);
    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
    const shortDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    const temperature = Math.round(forecast.main.temp);
    const tempColorClass = getTemperatureColor(temperature);

    card.innerHTML = `
        <h3>${dayName}</h3>
        <p class="date">${shortDate}</p>
        <img src="https://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png" alt="${forecast.weather[0].description}" class="weather-icon">
        <p class="condition">${forecast.weather[0].main}</p>
        <p class="temperature ${tempColorClass}">${temperature}°C</p>
    `;
    return card;
};

/**
 * Shows a loading state with skeleton cards.
 */
const showLoadingState = () => {
    forecastContainer.innerHTML = '';
    errorContainer.style.display = 'none';
    for (let i = 0; i < 5; i++) {
        const skeletonCard = document.createElement('div');
        skeletonCard.className = 'card skeleton';
        forecastContainer.appendChild(skeletonCard);
    }
};

/**
 * Displays an error message in the UI.
 * @param {string} message - The error message to display.
 */
const showError = (message) => {
    forecastContainer.innerHTML = '';
    errorMessageElement.textContent = message;
    errorContainer.style.display = 'block';
};

// --- UTILITY FUNCTIONS ---

/**
 * Updates the current date and time display.
 */
const updateDateTime = () => {
    const now = new Date();
    currentDatetimeElement.textContent = now.toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

/**
 * Updates the "last updated" timestamp.
 */
const updateLastUpdated = () => {
    const now = new Date();
    lastUpdatedElement.textContent = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
    });
};

/**
 * Returns a CSS class based on the temperature value.
 * @param {number} temp - The temperature in Celsius.
 * @returns {string} The CSS class for temperature color.
 */
const getTemperatureColor = (temp) => {
    if (temp >= 30) return 'hot';
    if (temp >= 25) return 'warm';
    if (temp >= 20) return 'cool';
    return 'cold';
};

// --- MAIN APPLICATION FLOW ---

/**
 * Main function to initialize and run the weather app.
 */
const main = async () => {
    showLoadingState();
    try {
        const weatherData = await fetchWeatherData();
        const groupedForecasts = groupForecastByDay(weatherData.list);
        const dailyForecasts = selectDailyTemperature(groupedForecasts);
        
        if (dailyForecasts.length === 0) {
            showError("No forecast data available for the next 5 days.");
            return;
        }

        renderForecast(dailyForecasts);
        updateLastUpdated();
    } catch (error) {
        showError("Failed to fetch weather data. Please check your connection or API key.");
    }
};

// --- EVENT LISTENERS ---
refreshBtn.addEventListener('click', main);

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    updateDateTime();
    setInterval(updateDateTime, 60000); // Update time every minute
    main();
});
