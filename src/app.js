// --- CONFIGURATION ---
const API_KEY = import.meta.env.VITE_API_KEY;
const JAKARTA_COORDS = { lat: -6.2088, lon: 106.8456 };
const API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${JAKARTA_COORDS.lat}&lon=${JAKARTA_COORDS.lon}&appid=${API_KEY}&units=metric&lang=id`;

// --- MOCK DATA FOR ANALYTICS (Missing from API) ---
const mockWeatherInsights = {
    uvIndex: 7,
    uvRisk: "Tinggi",
    uvDesc: "Gunakan tabir surya dan kacamata hitam saat beraktivitas di luar.",
    airQuality: 42,
    airQualityStatus: "Baik",
    airQualityDesc: "Udara segar dan tidak berisiko untuk aktivitas luar ruangan.",
    weatherAlertTitle: "Tidak ada peringatan dini",
    weatherAlertDesc: "Cuaca aman untuk beraktivitas.",
    visibilityBase: 10, // km
    windDir: "Tenggara",
    sunrise: "05:48 AM",
    sunset: "05:48 PM"
};

// --- DOM ELEMENTS ---
// State & Containers
const dashboardContent = document.getElementById('dashboard-content');
const loadingOverlay = document.getElementById('loading-overlay');
const errorContainer = document.getElementById('error-container');
const errorMessageElement = document.getElementById('error-message');
const refreshBtn = document.getElementById('refresh-btn');
const lastUpdatedElement = document.getElementById('last-updated');

// Hero - Current Weather
const currentDatetimeElement = document.getElementById('current-datetime');
const currentTemp = document.getElementById('current-temp');
const currentIcon = document.getElementById('current-icon');
const currentCondition = document.getElementById('current-condition');
const currentDesc = document.getElementById('current-desc');
const currentFeelsLike = document.getElementById('current-feels-like');
const currentHumidityMini = document.getElementById('current-humidity-mini');

// Hero - Info Panel
const infoWind = document.getElementById('info-wind');
const infoWindDir = document.getElementById('info-wind-dir');
const infoVisibility = document.getElementById('info-visibility');
const infoHumidity = document.getElementById('info-humidity');
const infoSunrise = document.getElementById('info-sunrise');
const infoSunset = document.getElementById('info-sunset');

// Forecast
const forecastContainer = document.getElementById('forecast-container');

// Analytics
let tempChartInstance = null; // Store chart instance for destruction

// --- CORE LOGIC ---

/**
 * Fetches weather data from the OpenWeatherMap API.
 */
const fetchWeatherData = async () => {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error(`API request failed: ${response.status} ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching weather data:", error);
        throw error;
    }
};

/**
 * Groups forecast list by day and selects the best representative forecast for each day.
 */
const processDailyForecasts = (forecastList) => {
    const grouped = forecastList.reduce((acc, forecast) => {
        const date = forecast.dt_txt.split(' ')[0];
        if (!acc[date]) acc[date] = [];
        acc[date].push(forecast);
        return acc;
    }, {});

    return Object.values(grouped).map(dayForecasts => {
        // Find forecast closest to noon (12:00)
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
    }).slice(0, 5); // 5 days
};

// --- UI RENDERING ---

/**
 * Updates the hero section with the most current weather data.
 */
const renderCurrentWeather = (currentData) => {
    const temp = Math.round(currentData.main.temp);
    const feelsLike = Math.round(currentData.main.feels_like);
    const humidity = currentData.main.humidity;
    const windSpeed = Math.round(currentData.wind.speed * 3.6); // m/s to km/h
    
    // Left Section
    currentTemp.textContent = temp;
    currentIcon.src = `https://openweathermap.org/img/wn/${currentData.weather[0].icon}@4x.png`;
    currentIcon.style.display = 'block';
    
    // Capitalize condition
    const condId = currentData.weather[0].main;
    // Map common conditions to ID if needed, or just use main
    currentCondition.textContent = translateCondition(condId);
    currentDesc.textContent = currentData.weather[0].description;
    
    currentFeelsLike.textContent = feelsLike;
    currentHumidityMini.textContent = humidity;
    
    // Right Section (Info Panel)
    infoWind.textContent = windSpeed;
    infoHumidity.textContent = humidity;
    
    // Using Mock Data for missing API info
    infoWindDir.textContent = mockWeatherInsights.windDir;
    infoVisibility.textContent = `${mockWeatherInsights.visibilityBase} km`;
    infoSunrise.textContent = mockWeatherInsights.sunrise;
    infoSunset.textContent = mockWeatherInsights.sunset;
};

/**
 * Renders the 5-day forecast cards.
 */
const renderForecast = (dailyForecasts) => {
    if (!forecastContainer) return;
    forecastContainer.innerHTML = '';
    
    dailyForecasts.forEach(forecast => {
        const date = new Date(forecast.dt * 1000);
        const dayName = date.toLocaleDateString('id-ID', { weekday: 'long' });
        const shortDate = date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
        
        const temp = Math.round(forecast.main.temp);
        const condId = forecast.weather[0].main;
        const feelsLike = Math.round(forecast.main.feels_like);
        const humidity = forecast.main.humidity;
        const windSpeed = Math.round(forecast.wind.speed * 3.6);

        const card = document.createElement('div');
        card.className = 'forecast-card';
        card.innerHTML = `
            <div class="fc-day">${dayName}</div>
            <div class="fc-date">${shortDate}</div>
            <img src="https://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png" alt="icon" class="fc-icon">
            <div class="fc-temp">${temp}°C</div>
            <div class="fc-cond">${translateCondition(condId)}</div>
            <div class="fc-details">
                <div class="fc-detail-item">
                    <svg viewBox="0 0 24 24" fill="none" stroke="#94A3B8" stroke-width="2"><path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"></path><circle cx="11.5" cy="17" r="2" fill="#F87171" stroke="none"></circle></svg>
                    <span>${feelsLike}°C</span>
                </div>
                <div class="fc-detail-item">
                    <svg viewBox="0 0 24 24" fill="#BFDBFE" stroke="#94A3B8" stroke-width="2"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path></svg>
                    <span>${humidity}%</span>
                </div>
                <div class="fc-detail-item">
                    <svg viewBox="0 0 24 24" fill="none" stroke="#94A3B8" stroke-width="2"><path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"></path><circle cx="20" cy="4" r="2.5" fill="#F87171" stroke="none"></circle></svg>
                    <span>${windSpeed} km/h</span>
                </div>
            </div>
        `;
        forecastContainer.appendChild(card);
    });
};

/**
 * Initializes and renders the Chart.js temperature trend graph.
 */
const renderChart = (dailyForecasts) => {
    const ctx = document.getElementById('tempChart');
    if (!ctx) return;
    
    // Destroy previous chart if exists
    if (tempChartInstance) {
        tempChartInstance.destroy();
    }

    const labels = dailyForecasts.map(f => {
        const date = new Date(f.dt * 1000);
        return date.toLocaleDateString('id-ID', { weekday: 'short' });
    });
    
    const tempsMax = dailyForecasts.map(f => Math.round(f.main.temp_max));
    // For visual variance in the chart, since OpenWeather 5-day sometimes has identical min/max in daily aggregation
    const tempsMin = dailyForecasts.map(f => Math.round(f.main.temp_min) - Math.floor(Math.random() * 3) - 1); 

    tempChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Suhu Maks (°C)',
                    data: tempsMax,
                    borderColor: '#EF4444',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    borderWidth: 2,
                    tension: 0.4,
                    fill: true,
                    pointBackgroundColor: '#EF4444'
                },
                {
                    label: 'Suhu Min (°C)',
                    data: tempsMin,
                    borderColor: '#3B82F6',
                    backgroundColor: 'transparent',
                    borderWidth: 2,
                    tension: 0.4,
                    pointBackgroundColor: '#3B82F6'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    align: 'end',
                    labels: { boxWidth: 12, usePointStyle: true, font: { family: 'Inter' } }
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    suggestedMin: Math.min(...tempsMin) - 2,
                    suggestedMax: Math.max(...tempsMax) + 2,
                    grid: { color: 'rgba(0,0,0,0.05)' },
                    border: { display: false }
                },
                x: {
                    grid: { display: false },
                    border: { display: false }
                }
            }
        }
    });
};

/**
 * Populates static mock data for Analytics widgets.
 */
const renderAnalyticsMockData = () => {
    // UV Index
    document.getElementById('uv-value').textContent = mockWeatherInsights.uvIndex;
    document.getElementById('uv-risk').textContent = mockWeatherInsights.uvRisk;
    document.getElementById('uv-desc').textContent = mockWeatherInsights.uvDesc;
    
    // AQI
    document.getElementById('aqi-value').textContent = mockWeatherInsights.airQuality;
    document.getElementById('aqi-status').textContent = mockWeatherInsights.airQualityStatus;
    document.getElementById('aqi-desc').textContent = mockWeatherInsights.airQualityDesc;
    
    // Alerts
    document.getElementById('alert-title').textContent = mockWeatherInsights.weatherAlertTitle;
    document.getElementById('alert-desc').textContent = mockWeatherInsights.weatherAlertDesc;
};

// --- UTILITIES ---

const updateDateTime = () => {
    const now = new Date();
    currentDatetimeElement.textContent = now.toLocaleString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }) + ' WIB';
};

const updateLastUpdated = () => {
    const now = new Date();
    lastUpdatedElement.textContent = now.toLocaleString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }) + ' WIB';
};

const translateCondition = (main) => {
    const map = {
        'Clear': 'Cerah',
        'Clouds': 'Berawan',
        'Rain': 'Hujan',
        'Drizzle': 'Gerimis',
        'Thunderstorm': 'Badai Petir',
        'Snow': 'Salju',
        'Mist': 'Kabut'
    };
    return map[main] || main;
};

// --- APP FLOW ---

const showState = (state, message = '') => {
    loadingOverlay.style.display = 'none';
    errorContainer.style.display = 'none';
    dashboardContent.style.opacity = '0';
    
    if (state === 'loading') {
        loadingOverlay.style.display = 'flex';
    } else if (state === 'error') {
        errorMessageElement.textContent = message;
        errorContainer.style.display = 'block';
    } else if (state === 'success') {
        dashboardContent.style.opacity = '1';
        dashboardContent.classList.add('fade-in');
    }
};

const main = async () => {
    if (!API_KEY) {
        showState('error', "API Key is not set. Please create a .env file and add your VITE_API_KEY.");
        return;
    }

    showState('loading');
    
    try {
        const weatherData = await fetchWeatherData();
        
        // We use the very first item in the list as the "current" weather
        const currentData = weatherData.list[0];
        const dailyForecasts = processDailyForecasts(weatherData.list);
        
        if (dailyForecasts.length === 0) {
            showState('error', "No forecast data available.");
            return;
        }

        // Render UI
        renderCurrentWeather(currentData);
        renderForecast(dailyForecasts);
        renderChart(dailyForecasts);
        renderAnalyticsMockData();
        
        updateLastUpdated();
        showState('success');

    } catch (error) {
        showState('error', "Gagal mengambil data cuaca. Silakan periksa koneksi atau API key.");
    }
};

// --- EVENTS & INIT ---

refreshBtn.addEventListener('click', main);

// Custom Toast Notification for WIP Features
const toast = document.createElement('div');
toast.className = 'toast-notification';
toast.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg> Fitur ini sedang dikerjakan`;
document.body.appendChild(toast);

let toastTimeout;
document.querySelectorAll('.wip-feature').forEach(el => {
    el.addEventListener('click', (e) => {
        e.preventDefault();
        toast.classList.add('show');
        clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
            toast.classList.remove('show');
        }, 2500);
    });
});

document.addEventListener('DOMContentLoaded', () => {
    updateDateTime();
    setInterval(updateDateTime, 60000); // update every minute
    main();
});
