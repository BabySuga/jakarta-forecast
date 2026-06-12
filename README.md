# Jakarta Weather Forecast

A clean, modern, and production-ready web application that displays the 5-day weather forecast for Jakarta. This project is built with vanilla HTML, CSS, and JavaScript, and uses Vite for a modern development and build setup. It focuses on clean code, maintainability, and a professional user interface.

![Jakarta Weather Forecast Screenshot](screenshots/screenshot.png)

## Features

- **5-Day Forecast**: Shows the weather forecast for the next five days.
- **Daily Summary**: Displays one representative temperature per day, preferring the forecast closest to noon.
- **Modern Tooling**: Uses Vite for a fast development experience and optimized production builds.
- **Dynamic UI**:
  - Modern, responsive glassmorphism design.
  - Loading skeletons while data is being fetched.
  - Graceful error handling with a clear error message card.
- **UX Enhancements**:
  - Real-time current date and time display.
  - Refresh button to fetch the latest data.
  - "Last updated" timestamp.
- **Bonus Features**:
  - Temperature-based color indicators.
  - Smooth fade-in animations for forecast cards.
  - Semantic HTML and accessibility improvements.

## Tech Stack

- **HTML5**: For the core structure and content.
- **CSS3**: For styling, layout, and animations.
- **JavaScript (ES6+)**: For application logic, API interaction, and DOM manipulation.
- **Vite**: As a build tool and development server.
- **OpenWeatherMap API**: For weather data.

## Project Structure

```
/
├── src/
│   ├── index.html
│   ├── styles.css
│   └── app.js
├── .env.example
├── .gitignore
├── package.json
├── vite.config.js
├── README.md
└── screenshots/
    └── screenshot.png
```

## Setup and Installation

To run this project locally, follow these steps:

### 1. Clone the repository

```bash
git clone https://github.com/your-username/jakarta-forecast.git
cd jakarta-forecast
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure API Key

You will need an API key from [OpenWeatherMap](https://openweathermap.org/appid). Sign up for a free account and get your key.

Create a `.env` file in the root of the project by copying the `.env.example` file:

```bash
cp .env.example .env
```

Then, open the `.env` file and add your API key:

```
VITE_API_KEY=YOUR_API_KEY_HERE
```

### 4. Run Locally

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or another port if 5173 is in use).

### 5. Build for Production

To create an optimized build for production:

```bash
npm run build
```

The production files will be in the `dist` directory.

### 6. Preview Production Build

To preview the production build locally:

```bash
npm run preview
```

## Deployment

This project is ready for deployment on platforms like Vercel or Netlify.

### Vercel

1.  Push your project to a GitHub repository.
2.  Go to your Vercel dashboard and import the repository.
3.  In the project settings, add the following environment variable:
    - `VITE_API_KEY` = `YOUR_API_KEY`
4.  Deploy. Vercel will automatically detect the Vite setup and build the project.

### Netlify

1.  Push your project to a GitHub repository.
2.  Go to your Netlify dashboard and connect the GitHub repository.
3.  Set the build command and publish directory:
    - **Build command**: `npm run build`
    - **Publish directory**: `dist`
4.  Add the environment variable in the site settings:
    - `VITE_API_KEY` = `YOUR_API_KEY`
5.  Deploy the site.

## Design Decisions

### UI/UX

- **Glassmorphism**: Chosen for its modern and visually appealing aesthetic. The blurred background effect provides depth and focuses the user's attention on the content.
- **Responsiveness**: A fluid grid layout adapts well from desktop to mobile screens, ensuring a good experience on any device.
- **Loading State**: Skeleton screens provide a better user experience than a simple spinner by giving a visual cue of the content that is about to be loaded.
- **Error Handling**: A dedicated error card is displayed if the API call fails, providing clear feedback to the user.

### Code Architecture

- **Modularity**: The JavaScript code is organized into logical functions (`fetchWeatherData`, `groupForecastByDay`, `renderForecast`, etc.) for readability and maintainability.
- **Vite**: Chosen for its fast development server and optimized build process, which are standard for modern front-end projects.
- **Security**: The API key is loaded from environment variables (`import.meta.env.VITE_API_KEY`) to prevent it from being exposed in the client-side source code, following security best practices.

### Data Processing

OpenWeatherMap's free tier provides forecast data in 3-hour intervals. The logic implemented addresses this by:

1.  **Grouping**: All forecast entries are grouped by their date.
2.  **Selection**: For each day, the forecast closest to 12:00 PM is selected as the representative temperature. This provides a consistent and meaningful daily value.

---

This project was built to demonstrate proficiency in front-end development fundamentals, including modern tooling, deployment practices, and code quality.
