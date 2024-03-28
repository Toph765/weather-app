import { format } from "date-fns";

let location = "baao";
let date;
let condition;
let feelsLike;
let humidity;
let sunrise;
let sunset;
let chanceOfRain;
let temp;
let windSpeed;

const dailyForecast = (day, temperature, weatherCondition) => ({
  day,
  temperature,
  weatherCondition,
});

function extractCurrentData(forecast) {
  const latestForecast = forecast.forecast.forecastday[0];
  const { current } = forecast;
  const dateTime = format(forecast.location.localtime, "PPPPpaaa").split(
    " at "
  );
  const time = dateTime[1];

  const tempC = `${current.temp_c}°C`;
  const tempF = `${current.temp_f}°F`;
  const feelsLikeC = `${current.feelslike_c}°C`;
  const feelsLikeF = `${current.feelslike_f}°F`;
  const windSpeedkph = `${current.wind_kph}kph`;
  const windSpeedmph = `${current.wind_mph}mph`;
  let data;

  date = `${dateTime[0]} ${time}`;
  condition = latestForecast.day.condition.text;
  humidity = `${current.humidity}%`;
  chanceOfRain = `${latestForecast.day.daily_chance_of_rain}%`;
  sunrise = latestForecast.astro.sunrise;
  sunset = latestForecast.astro.sunset;
  temp = [tempC, tempF];
  feelsLike = [feelsLikeC, feelsLikeF];
  windSpeed = [windSpeedkph, windSpeedmph];

  data = [
    location,
    date,
    condition,
    chanceOfRain,
    humidity,
    temp,
    feelsLike,
    windSpeed,
    sunrise,
    sunset,
  ];

  /* console.log(
    location,
    date,
    condition,
    chanceOfRain,
    humidity,
    temp,
    feelsLike,
    windSpeed,
    sunrise,
    sunset
  ); */

  return data;
}

function extractWeeklyData(forecast) {
  const { forecastday } = forecast.forecast;
  const weeklyForecast = [];

  for (let i = 1; i < forecastday.length; i++) {
    const day = format(forecastday[i].date, "EEEE");
    const tempC = `${forecastday[i].day.avgtemp_c}°C`;
    const tempF = `${forecastday[i].day.avgtemp_f}°F`;
    const dailyTemp = [tempC, tempF];
    const dailyCondition = forecastday[i].day.condition.text;
    const daily = dailyForecast(day, dailyTemp, dailyCondition);

    weeklyForecast.push(daily);
  }

  /* console.log(weeklyForecast); */

  return weeklyForecast;
}

async function getForecast(loc) {
  try {
    const response = await fetch(
      `http://api.weatherapi.com/v1/forecast.json?key=b855df3755664a11b0340510241903&q=${loc}&days=8`,
      { mode: "cors" }
    );

    const forecast = await response.json();

    if (forecast.error) return console.log(forecast.error.message);
    else {
      console.log(forecast);
    }
    return forecast;
  } catch (err) {
    return console.log(`something went wrong ${err}`);
  }
}

getForecast(location).then((forecast) => {
  const current = extractCurrentData(forecast);
  const weekly = extractWeeklyData(forecast);
  console.log(current, weekly);
});

const searchBtn = document.querySelector("button");
const searchField = document.querySelector("input");

searchBtn.addEventListener("click", (e) => {
  e.preventDefault();

  const query = searchField.value;
  location = query;

  getForecast(location).then((forecast) => {
    const current = extractCurrentData(forecast);
    const weekly = extractWeeklyData(forecast);
    console.log(current, weekly);
  });
});
