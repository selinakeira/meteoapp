"use strict";

// Select elements
const dayEl = document.querySelector(".default_day");
const dateEl = document.querySelector(".default_date");
const formEl = document.querySelector("form");
const inputEl = document.querySelector(".input_field");
const btnEl = document.querySelector(".btn_search");
const iconContainer = document.querySelector(".icons");
const contentSectionEl = document.querySelector(".content_section");
const weatherImage = document.querySelector(".default_info img");

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
  const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,rain,snowfall,cloud_cover,wind_speed_10m&timezone=Europe%2FBerlin`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    // Extract the hourly data
    const { time, temperature_2m, rain, snowfall, cloud_cover, wind_speed_10m } = data.hourly;

    // Display the current hour's weather
    const currentIndex = new Date().getHours();
    document.querySelector('.location-value').textContent = location;
    document.querySelector('.temperature-value').textContent = `${temperature_2m[currentIndex]} °C`;
    document.querySelector('.rain-value').textContent = `${rain[currentIndex]} mm`;
    document.querySelector('.wind-speed-value').textContent = `${wind_speed_10m[currentIndex]} km/h`;
    document.querySelector('.snowfall-value').textContent = `${snowfall[currentIndex]} cm`;
    document.querySelector('.cloud-cover-value').textContent = `${cloud_cover[currentIndex]} %`;

    // Display the weather image
    displayWeatherImage(rain[currentIndex], snowfall[currentIndex], wind_speed_10m[currentIndex], cloud_cover[currentIndex]);

    // Display the forecast for the next 7 days
    displayForecast(time, temperature_2m, rain, snowfall, cloud_cover, wind_speed_10m);
  } catch (error) {
    console.error('Error:', error);
    document.querySelector('.temperature-value').textContent = 'Fehler';
    document.querySelector('.rain-value').textContent = 'Fehler';
    document.querySelector('.wind-speed-value').textContent = 'Fehler';
    document.querySelector('.snowfall-value').textContent = 'Fehler';
    document.querySelector('.cloud-cover-value').textContent = 'Fehler';
  }
}

// Function to display the weather image
function displayWeatherImage(rain, snow, wind, cloud) {
  let imageUrl = '';

  if (rain > 1) {
    imageUrl = 'images/rain.png';
  } else if (snow > 1) {
    imageUrl = 'images/snow.png';
  } else if (cloud > 75) {
    imageUrl = 'images/cloudy.png';
  } else if (cloud > 50) {
    imageUrl = 'images/clouds.png';
  } else {
    imageUrl = 'images/clear.png';
  }

  weatherImage.src = imageUrl;
  weatherImage.style.display = 'block';
}

// Function to display the forecast for the next 7 days
function displayForecast(timeData, tempData, rainData, snowData, cloudData, windData) {
  const forecastContainer = document.querySelector('.list_content ul');
  forecastContainer.innerHTML = '';

  for (let i = 0; i < 7; i++) {
    const forecastDate = new Date(timeData[i * 24]); // Each day is represented by every 24th hour
    const dayName = days[forecastDate.getDay()].slice(0, 3);

    const forecastItem = document.createElement('li');
    forecastItem.innerHTML = `
      <span>${dayName}</span>
      <span class="day_tem">${tempData[i * 24]} °C</span>
      <span class="day_rain">${rainData[i * 24]} mm</span>
      <span class="day_snow">${snowData[i * 24]} cm</span>
      <span class="day_wind">${windData[i * 24]} km/h</span>
      <span class="day_cloud">${cloudData[i * 24]} %</span>
    `;
    forecastContainer.appendChild(forecastItem);
  }
}
