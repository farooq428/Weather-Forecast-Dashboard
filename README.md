# 🌦️ Weather API Implementation

A modern, responsive **Next.js Weather Dashboard** that fetches real-time weather data and **3-day forecasts** from [WeatherAPI](https://www.weatherapi.com/), visualizes hourly forecast data using **Recharts**, and provides a clean, recruiter-ready user interface.

Built with **Next.js, TypeScript, Tailwind CSS, and Recharts**, with a focus on clean architecture, responsive design, and a smooth user experience.

---

## ✨ Features

* 🌤️ **Current Weather**

  * Temperature
  * Weather condition
  * Feels-like temperature
  * Humidity
  * Wind speed
  * Rainfall

* 📅 **3-Day Weather Forecast**

  * Daily weather summary
  * Maximum and minimum temperature
  * Rain chance
  * Precipitation information

* 📊 **Hourly Weather Charts**

  * Hour-by-hour temperature
  * Weather forecast visualization
  * Built with Recharts

* 🔎 **City & Coordinate Search**

  * Search weather by city name
  * Search using latitude and longitude

* 📍 **Use My Location**

  * Uses the browser's Geolocation API
  * Automatically gets the user's latitude and longitude
  * Fetches weather for the current location

* 💾 **Persistent Recent Location**

  * Saves the user's latest searched city using `localStorage`
  * Automatically restores the saved city when the website is opened again

* 🔐 **Secure API Handling**

  * WeatherAPI requests are handled through a Next.js API route
  * API key is kept on the server instead of being exposed directly in the browser

* 📱 **Responsive Design**

  * Works across desktop, tablet, and mobile devices
  * Built with Tailwind CSS

* ⚡ **Modern Next.js Architecture**

  * Reusable React components
  * TypeScript interfaces and types
  * Client and server-side separation

---

## 🛠️ Tech Stack

| Technology                  | Purpose                                   |
| --------------------------- | ----------------------------------------- |
| **Next.js**                 | React framework and application structure |
| **React**                   | UI development                            |
| **TypeScript**              | Type safety and better code quality       |
| **Tailwind CSS**            | Responsive styling                        |
| **Recharts**                | Weather data visualization                |
| **WeatherAPI**              | Weather and forecast data                 |
| **Browser Geolocation API** | Current location detection                |
| **localStorage**            | Persisting the user's selected location   |

---

## 🏗️ Project Structure

```text
weather-dashboard/
│
├── app/
│   ├── api/
│   │   └── weather/
│   │       └── route.ts
│   │
│   ├── components/
│   │   ├── WeatherSearch.tsx
│   │   ├── CurrentWeather.tsx
│   │   ├── Forecast.tsx
│   │   └── WeatherChart.tsx
│   │
│   ├── page.tsx
│   ├── layout.tsx
│   └── globals.css
│
├── public/
│
├── .env.local
├── .gitignore
├── package.json
└── README.md
```

> The exact component names and folders may vary depending on the current project implementation.

---

## 🔐 Environment Variables

Create a `.env.local` file in the root directory:

```env
WEATHER_API_KEY=your_weatherapi_key
```

Get your API key from:

https://www.weatherapi.com/

### Important

Never commit `.env.local` to GitHub.

Make sure it is included in `.gitignore`:

```gitignore
.env.local
.env*.local
```

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/your-repository.git
```

### 2. Navigate to the project

```bash
cd your-repository
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure environment variables

Create:

```text
.env.local
```

and add:

```env
WEATHER_API_KEY=your_weatherapi_key
```

### 5. Start the development server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

## 🔄 How It Works

The application follows this basic flow:

```text
User searches for a city
        │
        ▼
WeatherSearch Component
        │
        ▼
Next.js API Route
        │
        ▼
WeatherAPI
        │
        ▼
Weather Data
        │
        ▼
Process & Display Data
        │
        ├── Current Weather
        ├── 3-Day Forecast
        └── Hourly Chart
```

### 📍 Current Location Flow

When the user clicks **"Use my location"**:

```text
User clicks "Use my location"
            │
            ▼
Browser Geolocation API
            │
            ▼
Latitude + Longitude
            │
            ▼
WeatherAPI
            │
            ▼
Current Weather + Forecast
```

The browser uses:

```javascript
navigator.geolocation.getCurrentPosition()
```

to obtain the user's coordinates.

---

## 💾 Saved Location

The application uses browser `localStorage` to remember the user's latest searched location.

When a user searches for a city:

```javascript
localStorage.setItem("weather-city", city);
```

When the application loads again:

```javascript
localStorage.getItem("weather-city");
```

The saved city is then used to automatically load its weather information.

### Example

```text
First visit
    ↓
Faisalabad
    ↓
User searches Lahore
    ↓
"Lahore" saved in localStorage
    ↓
User refreshes/reopens website
    ↓
"Lahore" loaded automatically
    ↓
Lahore weather displayed
```

---

## 🔒 API Security

Instead of exposing the WeatherAPI key directly in the client-side code, the application uses a **Next.js server-side API route**.

```text
Browser
   │
   │ Request
   ▼
Next.js API Route
   │
   │ API key stays on server
   ▼
WeatherAPI
```

This prevents the API key from being directly exposed in the browser.

---

## 📊 Data Visualization

Hourly weather data is visualized using **Recharts**.

The dashboard can display information such as:

* Hourly temperature
* Rain probability
* Precipitation
* Other forecast metrics

Example flow:

```text
WeatherAPI
    ↓
Hourly Forecast Data
    ↓
Transform Data
    ↓
Recharts
    ↓
Interactive Weather Chart
```

---

## 🎨 UI & UX

The dashboard is designed with a focus on:

* Clean and minimal interface
* Responsive layouts
* Clear weather information
* Easy navigation
* Loading states
* Error handling
* Empty states
* Mobile-friendly controls
* Accessible form elements

The goal is to keep the interface **simple, readable, and recruiter-ready**.

---

## 🧠 Key Learning Outcomes

This project demonstrates practical experience with:

* Next.js App Router
* React components
* TypeScript
* API integration
* Server-side API routes
* Environment variables
* REST API requests
* `async/await`
* Error handling
* Browser Geolocation API
* Browser `localStorage`
* React state management
* Responsive Tailwind CSS
* Data visualization with Recharts
* Component-based architecture

---

## 📌 Future Improvements

Possible future improvements include:

* 🌍 Automatic reverse geocoding for coordinates
* 🌙 Dark mode
* ⭐ Multiple saved cities
* 📈 More weather charts
* 🌡️ Temperature unit switching
* 🔔 Weather alerts
* 🌐 Multi-language support
* 📱 Progressive Web App (PWA) support
* ⚡ API response caching

---

## 📄 License

This project is created for **learning, portfolio, and software development practice purposes**.

---

## 👨‍💻 Author

**M. Umar Farooq**

Software Engineering Student | Full Stack Developer

Built with ❤️ using **Next.js, TypeScript, Tailwind CSS, Recharts, and WeatherAPI**.
