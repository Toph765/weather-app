import { format } from "date-fns";

const location = "baao";
let date;
let condition;
let feelsLike;
let humidity;
let sunrise;
let sunset;
let chanceOfRain;
let temp;
let windSpeed;

function extractData(forecast) {
  const latestForecast = forecast.forecast.forecastday[0];
  const { current } = forecast;
  const dateTime = format(forecast.location.localtime, "PPPPpaaa").split(
    " at "
  );
  const time = dateTime[1];

  date = `${dateTime[0]} ${time}`;
  condition = latestForecast.day.condition.text;
  temp = `${current.temp_c}°C`;
  feelsLike = `${current.feelslike_c}°C`;
  humidity = `${current.humidity}%`;
  chanceOfRain = `${latestForecast.day.daily_chance_of_rain}%`;
  windSpeed = `${current.wind_kph}kph`;
  sunrise = latestForecast.astro.sunrise;
  sunset = latestForecast.astro.sunset;
  console.log(
    location,
    date,
    condition,
    temp,
    feelsLike,
    humidity,
    chanceOfRain,
    windSpeed,
    sunrise,
    sunset
  );
}

async function getForecast(loc) {
  try {
    const response = await fetch(
      `http://api.weatherapi.com/v1/forecast.json?key=b855df3755664a11b0340510241903&q=${loc}&days=8`,
      { mode: "cors" }
    );

    const forecast = await response.json();

    if (forecast.error) console.log(forecast.error.message);
    else {
      console.log(forecast);
    }

    extractData(forecast);
  } catch (err) {
    console.log(`something went wrong ${err}`);
  }
}

getForecast(location);
