import { format } from "date-fns";

const searchBtn = document.querySelector("button");
const unitBtn = document.querySelector(".unit");

let location = "manila";
let forecast;
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
  if (forecast.error) return;

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
  if (forecast.error) return;

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
    const errorMsg = document.querySelector(".error");
    const response = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=b855df3755664a11b0340510241903&q=${loc}&days=8`,
      { mode: "cors" }
    );

    forecast = await response.json();

    if (forecast.error) {
      errorMsg.removeAttribute("hidden");
    } else {
      errorMsg.setAttribute("hidden", "");
    }
    return forecast;
  } catch (err) {
    return console.log(`something went wrong ${err}`);
  }
}

function displayData(current, weekly) {
  if (current === undefined || weekly === undefined) return;

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
  const locData = current[0];

  location.textContent = capitalize(locData);
  date.textContent = current[1];
  condition.textContent = current[2];
  uvIndex.textContent = `UV Index: ${current[6]}`;
  humidity.textContent = `Humidity: ${current[5]}`;
  chanceOfRain.textContent = `Chance of Rain: ${current[4]}`;
  sunrise.textContent = `Sunrise: ${current[10]}`;
  sunset.textContent = `Sunset: ${current[11]}`;

  conIcon.src = current[3];

  if (main.classList.contains("celsius")) {
    temp.textContent = `Temp: ${current[7][0]}`;
    feelsLike.textContent = `Feels Like: ${current[8][0]}`;
    windSpeed.textContent = `Wind Speed: ${current[9][0]}`;
  } else {
    temp.textContent = `Temp: ${current[7][1]}`;
    feelsLike.textContent = `Feels Like: ${current[8][1]}`;
    windSpeed.textContent = `Wind Speed: ${current[9][1]}`;
  }

  let count = 0;

  weeklyForecast.forEach((forecast) => {
    const day = document.createElement("div");
    const temp = document.createElement("div");
    const icon = document.createElement("img");
    const condition = document.createElement("div");
    const container = document.createElement("div");

    while (forecast.lastElementChild)
      forecast.removeChild(forecast.lastElementChild);

    day.textContent = weekly[count].day;
    condition.textContent = weekly[count].weatherCondition;
    container.classList.add("iconContainer");

    icon.src = weekly[count].icon;

    if (main.classList.contains("celsius"))
      temp.textContent = weekly[count].temperature[0];
    else temp.textContent = weekly[count].temperature[1];

    container.append(icon, condition);
    forecast.append(day, temp, container);

    count += 1;
  });
}

function capitalize(text) {
  if (text.includes(" ")) {
    let data = text.split(" ");
    for (let i = 0; i < data.length; i++) {
      data[i] = data[i][0].toUpperCase() + data[i].slice(1);
    }
    return (data = data.join(" "));
  } else return text[0].toUpperCase() + text.slice(1);
}

searchBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const searchField = document.querySelector("input");

  location = searchField.value;

  getForecast(location).then((forecast) => {
    const current = extractCurrentData(forecast);
    const weekly = extractWeeklyData(forecast);
    displayData(current, weekly);
    searchField.value = "";
  });
});

unitBtn.addEventListener("click", () => {
  const current = extractCurrentData(forecast);
  const weekly = extractWeeklyData(forecast);
  const main = document.querySelector("main");

  main.classList.toggle("celsius");

  displayData(current, weekly);

  if (main.classList.contains("celsius")) unitBtn.textContent = "°F/mph";
  else unitBtn.textContent = "°C/kph";
});

document.onload = getForecast(location).then((forecast) => {
  current = extractCurrentData(forecast);
  weekly = extractWeeklyData(forecast);
  displayData(current, weekly);
});
