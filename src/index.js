async function getWeatherData(loc) {
  try {
    const response = await fetch(
      `http://api.weatherapi.com/v1/current.json?key=b855df3755664a11b0340510241903&q=${loc}`,
      { mode: "cors" }
    );

    const weatherData = await response.json();

    if (weatherData.error) console.log(weatherData.error.message);
    else console.log(weatherData);
  } catch (err) {
    console.log(`something went wrong ${err}`);
  }
}

getWeatherData("baao");
