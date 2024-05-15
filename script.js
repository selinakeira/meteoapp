"use strict";

// Define the API URL
const apiUrl = 'https://api.open-meteo.com/v1/forecast?latitude=47.3667&longitude=8.55&daily=temperature_2m_max,rain_sum,snowfall_sum,wind_speed_10m_max&timezone=Europe%2FBerlin';

// Select elements
const dayEl = document.querySelector(".default_day");
const dateEl = document.querySelector(".default_date");
const formEl = document.querySelector("form");
const inputEl = document.querySelector(".input_field");
const btnEl = document.querySelector(".btn_search");
const iconContainer = document.querySelector(".icons");
const contentSectionEl = document.querySelector(".content_section");

const dayInfoEl = document.querySelector(".day_info");
const listContentEl = document.querySelector(".list_content ul");

// default date and location
const days = [
  "Montag",
  "Dienstag",
  "Mittwoch",
  "Donnerstag",
  "Freitag",
  "Samstag",
  "Sonntag",
];

// display day
const day = new Date();
const dayName = days[day.getDay()];
dayEl.textContent = dayName;

// Month
let month = day.toLocaleString("default", { month: "long" });
let date = day.getDate();
let year = day.getFullYear();
dateEl.textContent = date + " " + month + " " + year;

// Fetch weather data
fetch(apiUrl)
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    // Extract the daily data
    const { time, temperature_2m_max, rain_sum, snowfall_sum, wind_speed_10m_max } = data.daily;

    // Display the current day's weather
    document.querySelector('.temperature-value').textContent = `${temperature_2m_max[0]} °C`;
    document.querySelector('.rain-value').textContent = `${rain_sum[0]} mm`;
    document.querySelector('.wind-speed-value').textContent = `${wind_speed_10m_max[0]} km/h`;
    document.querySelector('.snowfall-value').textContent = `${snowfall_sum[0]} cm`;

    // Display the forecast for the next 7 days
    displayForecast(time, temperature_2m_max, rain_sum, snowfall_sum, wind_speed_10m_max);
  })
  .catch(error => {
    console.error('Error:', error);
    document.querySelector('.temperature-value').textContent = 'Fehler';
    document.querySelector('.rain-value').textContent = 'Fehler';
    document.querySelector('.wind-speed-value').textContent = 'Fehler';
    document.querySelector('.snowfall-value').textContent = 'Fehler';
  });

// Function to display the forecast for the next 7 days
function displayForecast(timeData, tempData, rainData, snowData, windData) {
  const forecastContainer = document.querySelector('.list_content ul');
  forecastContainer.innerHTML = '';

  for (let i = 0; i < 7; i++) {
    const forecastDate = new Date(timeData[i]);
    const dayName = days[forecastDate.getDay()].slice(0, 3);

    const forecastItem = document.createElement('li');
    forecastItem.innerHTML = `
      <span>${dayName}</span>
      <span class="day_tem">${tempData[i]} °C</span>
      <span class="day_rain">${rainData[i]} mm</span>
      <span class="day_snow">${snowData[i]} cm</span>
      <span class="day_wind">${windData[i]} km/h</span>
    `;
    forecastContainer.appendChild(forecastItem);
  }
}

// Event listener for the search form
btnEl.addEventListener("click", (e) => {
  e.preventDefault();

  if (inputEl.value !== "") {
    // Assign values in the left side location
    const search = inputEl.value;
    inputEl.value = "";
    findLocation(search);
  } else {
    alert("Bitte geben Sie den Namen einer Stadt oder eines Landes ein!");
  }
});

// Function to find the location weather
async function findLocation(name) {
  try {
    iconContainer.innerHTML = "";
    dayInfoEl.innerHTML = "";
    listContentEl.innerHTML = "";
    const API_URL = `https://api.openweathermap.org/data/2.5/weather?q=${name}&appid=${API}`;
    const data = await fetch(API_URL);
    const result = await data.json();

    console.log(result);

    // Error Handling
    if (result.cod !== "404") {
      // Display image and temperature
      const displayImageContent = imgContent(result);

      // Display side content
      const sideContent = displaySideContent(result);

      // Forecast lat and lon
      displayForeCast(result.coord.lat, result.coord.lon);

      setTimeout(() => {
        iconContainer.insertAdjacentHTML("afterbegin", displayImageContent);
        dayInfoEl.insertAdjacentHTML("afterbegin", sideContent);

        iconContainer.classList.add("fadeIn");
        dayInfoEl.classList.add("fadeIn");
        listContentEl.classList.add("fadeIn");
      }, 1500);
    } else {
      const message = `
      <h2 class="weather_temp">${result.cod}</h2>
      
      <h3 class="cloudtxt">${result.message}</h3>`;
      iconContainer.insertAdjacentHTML("afterbegin", message);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

// Display image and temperature function
function imgContent(resultData) {
  return `<img
  src="https://openweathermap.org/img/wn/${resultData.weather[0].icon}@4x.png"
  alt=""/>
  <h2 class="weather_temp">${Math.round(resultData.main.temp - 275.15) + "°C"}</h2>
  <h3 class="cloudtxt">${resultData.weather[0].description}</h3>`;
}

// Display side bar text function
function displaySideContent(data) {
  return `
    <div class="content">
      <p class="title">Standort</p>
      <span class="location-value">${data.name}</span>
    </div>
    <div class="content">
      <p class="title">Temperatur</p>
      <span class="value">${Math.round(data.main.temp - 275.15) + "°C"}</span>
    </div>
    <div class="content">
      <p class="title">Luftfeuchtigkeit</p>
      <span class="value">${data.main.humidity} %</span>
    </div>
    <div class="content">
      <p class="title">Windgeschwindigkeit</p>
      <span class="value">${data.wind.speed} Km/h</span>
    </div>
  `;
}

// Forecast API function
async function displayForeCast(lat, long) {
  const foreCast_ApI = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&appid=${API}`;
  const data = await fetch(foreCast_ApI);
  const result = await data.json();

  // Filter the forecasts to get only one forecast per day
  const uniqueForecastDays = [];
  const fiveDaysForecast = result.list.filter((forecast) => {
    const forecastDate = new Date(forecast.dt_txt).getDate();
    if (!uniqueForecastDays.includes(forecastDate)) {
      return uniqueForecastDays.push(forecastDate);
    }
  });

  fiveDaysForecast.forEach((content, indx) => {
    if (indx <= 6) { // Changed to 6 to get the next 7 days
      listContentEl.insertAdjacentHTML("afterbegin", foreCast(content));
    }
  });

  console.log(fiveDaysForecast);
}

// Forecast HTML elements function
function foreCast(frContent) {
  // Display day
  const day = new Date(frContent.dt_txt);
  const dayName = days[day.getDay()];
  const splitDay = dayName.split("", 3);
  const joinDay = splitDay.join("");

  return `
    <li>
      <img
        src="https://openweathermap.org/img/wn/${frContent.weather[0].icon}@2x.png"
        alt=""
        class="weather_img_icon"
      />
      <span>${joinDay}</span>
      <span class="day_tem">${Math.round(frContent.main.temp - 275.15) + "°C"}</span>
    </li>
  `;
}
