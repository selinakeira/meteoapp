"use strict";

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

// Event listener for the search form
btnEl.addEventListener("click", (e) => {
  e.preventDefault();

  if (inputEl.value !== "") {
    const search = inputEl.value;
    inputEl.value = "";
    getCoordinates(search);
  } else {
    alert("Bitte geben Sie den Namen einer Stadt oder eines Landes ein!");
  }
});

// Function to get coordinates for a given location
async function getCoordinates(location) {
  try {
    const API_URL = `https://nominatim.openstreetmap.org/search?q=${location}&format=json&limit=1`;
    const response = await fetch(API_URL);
    const data = await response.json();

    if (data.length > 0) {
      const { lat, lon } = data[0];
      fetchWeatherData(lat, lon, location);
    } else {
      alert("Standort nicht gefunden!");
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

// Function to fetch weather data
async function fetchWeatherData(lat, lon, location) {
  const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,rain_sum,snowfall_sum,wind_speed_10m_max&timezone=Europe%2FBerlin`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    // Extract the daily data
    const { time, temperature_2m_max, rain_sum, snowfall_sum, wind_speed_10m_max } = data.daily;

    // Display the current day's weather
    document.querySelector('.location-value').textContent = location;
    document.querySelector('.temperature-value').textContent = `${temperature_2m_max[0]} °C`;
    document.querySelector('.rain-value').textContent = `${rain_sum[0]} mm`;
    document.querySelector('.wind-speed-value').textContent = `${wind_speed_10m_max[0]} km/h`;
    document.querySelector('.snowfall-value').textContent = `${snowfall_sum[0]} cm`;

    // Display the forecast for the next 7 days
    displayForecast(time, temperature_2m_max, rain_sum, snowfall_sum, wind_speed_10m_max);
  } catch (error) {
    console.error('Error:', error);
    document.querySelector('.temperature-value').textContent = 'Fehler';
    document.querySelector('.rain-value').textContent = 'Fehler';
    document.querySelector('.wind-speed-value').textContent = 'Fehler';
    document.querySelector('.snowfall-value').textContent = 'Fehler';
  }
}

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