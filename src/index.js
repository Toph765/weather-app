import { format } from "date-fns";

let location = "baao";
let date;
let condition;
let conIcon;
let feelsLike;
let humidity;
let sunrise;
let sunset;
let chanceOfRain;
let temp;
let windSpeed;
let uvIndex;
let current;
let weekly;

const dailyForecast = (day, temperature, weatherCondition, icon) => ({
  day,
  temperature,
  weatherCondition,
  icon,
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
  uvIndex = current.uv;
  conIcon = latestForecast.day.condition.icon;
  sunrise = latestForecast.astro.sunrise;
  sunset = latestForecast.astro.sunset;
  temp = [tempC, tempF];
  feelsLike = [feelsLikeC, feelsLikeF];
  windSpeed = [windSpeedkph, windSpeedmph];

  data = [
    location,
    date,
    condition,
    conIcon,
    chanceOfRain,
    humidity,
    uvIndex,
    temp,
    feelsLike,
    windSpeed,
    sunrise,
    sunset,
  ];

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
    const dailyIcon = forecastday[i].day.condition.icon;
    const daily = dailyForecast(day, dailyTemp, dailyCondition, dailyIcon);

    weeklyForecast.push(daily);
  }

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

function displayData(current, weekly) {
  const main = document.querySelector("main");
  const location = document.querySelector(".location");
  const date = document.querySelector(".date");
  const conIcon = document.querySelector(".conIcon");
  const condition = document.querySelector(".condition");
  const temp = document.querySelector(".temp");
  const feelsLike = document.querySelector(".feelsLike");
  const uvIndex = document.querySelector(".uvIndex");
  const humidity = document.querySelector(".humidity");
  const chanceOfRain = document.querySelector(".chanceOfRain");
  const windSpeed = document.querySelector(".windSpeed");
  const sunrise = document.querySelector(".sunrise");
  const sunset = document.querySelector(".sunset");
  const weeklyForecast = document.querySelectorAll(".weekly");

  location.textContent = current[0];
  date.textContent = current[1];
  condition.textContent = current[2];
  uvIndex.textContent = current[6];
  humidity.textContent = current[5];
  chanceOfRain.textContent = current[4];
  sunrise.textContent = current[10];
  sunset.textContent = current[11];

  conIcon.src = current[3];

  if (main.classList.contains("celsius")) {
    temp.textContent = current[7][0];
    feelsLike.textContent = current[8][0];
    windSpeed.textContent = current[9][0];
  } else {
    temp.textContent = current[7][1];
    feelsLike.textContent = current[8][1];
    windSpeed.textContent = current[9][1];
  }

  let count = 0;

  weeklyForecast.forEach((forecast) => {
    const day = document.createElement("span");
    const temp = document.createElement("span");
    const icon = document.createElement("img");
    const condition = document.createElement("span");

    while (forecast.lastElementChild)
      forecast.removeChild(forecast.lastElementChild);

    day.textContent = weekly[count].day;
    condition.textContent = weekly[count].weatherCondition;

    icon.src = weekly[count].icon;

    if (main.classList.contains("celsius"))
      temp.textContent = weekly[count].temperature[0];
    else temp.textContent = weekly[count].temperature[1];

    forecast.append(day, temp, icon, condition);

    count += 1;
  });
}

getForecast(location).then((forecast) => {
  current = extractCurrentData(forecast);
  weekly = extractWeeklyData(forecast);
  displayData(current, weekly);
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
    displayData(current, weekly);
    console.log(current, weekly);
  });
});
