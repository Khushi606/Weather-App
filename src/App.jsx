import { useEffect, useState } from "react";
import SearchBar from "./components/SearchBar";
import ReactAnimatedWeather from "react-animated-weather";
import clear_icon from "./assets/clear.png";
import cloud_icon from "./assets/cloud.png";
import drizzle_icon from "./assets/drizzle.png";
import humidity_icon from "./assets/humidity.png";
import rain_icon from "./assets/rain.png";
import snow_icon from "./assets/snow.png";
import wind_icon from "./assets/wind.png";

const App = () => {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null); // Store weather data
  const [forecastData, setForecastData] = useState(null); // Store weather data
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const weatherIcons = {
    Clear: clear_icon,
    Clouds: cloud_icon,
    Rain: rain_icon,
    Snow: snow_icon,
    Drizzle: drizzle_icon,
    Default: cloud_icon,
  };

  const handleSearch = (searchedCity) => {
    setCity(searchedCity);
    console.log(searchedCity);
  };

  const formatDate = (date) => {
    const options = {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    };
    return date.toLocaleDateString("en-US", options);
  };

  const currentDate = new Date();
  const formattedDate = formatDate(currentDate);
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${
    import.meta.env.VITE_APP_ID
  }`;
  const proxyUrl = "https://cors-anywhere.herokuapp.com/";

  useEffect(() => {
    const fetchWeatherData = async () => {
      setLoading(true);
      try {
        const response = await fetch(proxyUrl + url);
        if (!response.ok) {
          throw new Error("City not found");
        }
        const data = await response.json();
        setWeatherData(data);
        // console.log(data);

        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${
          import.meta.env.VITE_APP_ID
        }`;
        const forecastResponse = await fetch(proxyUrl + forecastUrl);
        if (!forecastResponse.ok) {
          throw new Error("Forecast data not found"); // Handle forecast errors
        }
        const forecastData = await forecastResponse.json();
        setForecastData(forecastData);
        console.log("Forecast Data:", forecastData);
      } catch (error) {
        setError(error.message);
        console.error("Error fetching weather data:", error);
        setWeatherData(null); // Reset weather data if city not found
        setForecastData(null);
      } finally {
        setLoading(false);
      }
    };

    if (city) {
      fetchWeatherData();
    }
  }, [city]);

  return (
    <div className="app-container">
      {/* <h1>Weather App</h1> */}
      <div className="weather-card">
        <SearchBar onSearch={handleSearch} />
        {!loading && !weatherData && !error && (
          <p className="welcome">Enter a city to get the weather forecast!</p>
        )}
        {loading && <div>Loading...</div>}
        {error && <div>Error: {error}</div>}
        {!error && weatherData && (
          <div>
            <div className="city-name">
              <h2>
                {weatherData.name},<span>{weatherData.sys.country}</span>
              </h2>
            </div>
            <div className="date">{formattedDate}</div>
            <div className="temp">
              {/* <img
                src={`http://openweathermap.org/img/w/${weatherData.weather[0].icon}.png`}
                alt={weatherData.weather[0].description}
                className="temp-icon"
              /> */}
              {/* {weatherIcons[weatherData.weather[0].main] ||
                weatherIcons.Default} */}
              <img
                src={
                  weatherIcons[weatherData.weather[0].main] ||
                  weatherIcons.Default
                }
                alt={weatherData.weather[0].description}
                className="temp-icon"
              />
              {Math.round(weatherData.main.temp)}
              <sup className="temp-deg">°C | °F</sup>
            </div>
            <p className="weather-des">{weatherData.weather[0].description}</p>
            <div className="weather-info">
              <div className="col">
                <div>
                  {/* <WiWindy size={40} className="wind-icon" /> */}
                  <ReactAnimatedWeather
                    icon="WIND"
                    color="black"
                    size={50}
                    animate={true}
                  />
                  <p className="wind">{weatherData.wind.speed} m/s</p>
                  <p>Wind Speed</p>
                </div>
              </div>
              <div className="col">
                <div>
                  {/* <WiHumidity size={40} className="humidity-icon" /> */}
                  <ReactAnimatedWeather
                    icon="RAIN"
                    color="black"
                    size={50}
                    animate={true}
                  />
                  <p className="humidity">{weatherData.main.humidity}%</p>
                  <p>Humidity</p>
                </div>
              </div>
            </div>
            {forecastData && (
              <div className="forecast">
                <h3>5-Day Forecast:</h3>
                <div className="forecast-container">
                  {Object.values(
                    forecastData.list.reduce((acc, item) => {
                      // Get the day (e.g., "Wed, 17")
                      const date = new Date(item.dt * 1000).toLocaleDateString(
                        "en-US",
                        {
                          weekday: "short",
                        }
                      );

                      if (!acc[date]) {
                        acc[date] = {
                          min: item.main.temp_min,
                          max: item.main.temp_max,
                          icon: item.weather[0].main,
                          date: date,
                        };
                      } else {
                        acc[date].min = Math.min(
                          acc[date].min,
                          item.main.temp_min
                        );
                        acc[date].max = Math.max(
                          acc[date].max,
                          item.main.temp_max
                        );
                      }

                      return acc;
                    }, {})
                  )
                    .slice(0, 5) // Keep only 5 days
                    .map((day, index) => (
                      <div className="day" key={index}>
                        <p className="day-name">{day.date}</p>
                        <img
                          className="day-icon"
                          src={weatherIcons[day.icon] || weatherIcons.Default}
                          alt={day.icon}
                        />
                        <p className="day-temperature">
                          {Math.round(day.min)}° /{" "}
                          <span>{Math.round(day.max)}°</span>
                        </p>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
