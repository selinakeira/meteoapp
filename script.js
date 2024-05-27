"use strict";

// Auswahl der Elemente
const dayEl = document.querySelector(".default_day");
const dateEl = document.querySelector(".default_date");
const locationNameEl = document.querySelector(".location-name"); // Standort Element
const formEl = document.querySelector("form");
const inputEl = document.querySelector(".input_field");
const btnEl = document.querySelector(".btn_search");
const iconContainer = document.querySelector(".icons");
const contentSectionEl = document.querySelector(".content_section");
const weatherImage = document.querySelector(".default_info img");

const dayInfoEl = document.querySelector(".day_info");
const listContentEl = document.querySelector(".list_content ul");

// Standarddaten für Wochentage
const daysFull = [
  "Montag",
  "Dienstag",
  "Mittwoch",
  "Donnerstag",
  "Freitag",
  "Samstag",
  "Sonntag",
];

const daysShort = [
  "MO", // Montag
  "DI", // Dienstag
  "MI", // Mittwoch
  "DO", // Donnerstag
  "FR", // Freitag
  "SA", // Samstag
  "SO", // Sonntag
];

// Anzeige des aktuellen Wochentags
const day = new Date();
const dayNameFull = daysFull[(day.getDay() + 6) % 7]; // Anpassung der Berechnung des Wochentags
dayEl.textContent = dayNameFull;

// Anzeige des aktuellen Datums
const months = [
  "Januar",
  "Februar",
  "März",
  "April",
  "Mai",
  "Juni",
  "Juli",
  "August",
  "September",
  "Oktober",
  "November",
  "Dezember",
];
let month = months[day.getMonth()];
let date = day.getDate();
let year = day.getFullYear();
dateEl.textContent = `${date}. ${month} ${year}`;

// Ereignislistener für das Suchformular
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

// Verwendung des aktuellen Standorts, wenn keine Eingabe erfolgt
window.addEventListener('load', () => {
  if (!inputEl.value) {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        const { latitude, longitude } = position.coords;
        fetchWeatherData(latitude, longitude, "Dein Standort");
      }, error => {
        console.error('Fehler beim Abrufen des Standorts:', error);
      });
    } else {
      alert('Geolocation wird von diesem Browser nicht unterstützt.');
    }
  }
});

// Funktion zum Abrufen der Koordinaten für einen gegebenen Standort
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
    console.error('Fehler:', error);
  }
}

// Funktion zum Abrufen der Wetterdaten
async function fetchWeatherData(lat, lon, location) {
  const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,rain,snowfall,cloud_cover,wind_speed_10m&timezone=Europe%2FBerlin`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    // Extrahieren der stündlichen Daten
    const { time, temperature_2m, rain, snowfall, cloud_cover, wind_speed_10m } = data.hourly;

    // Anzeige des Wetters der aktuellen Stunde
    const currentIndex = new Date().getHours();
    locationNameEl.textContent = location; // Standort setzen
    document.querySelector('.temperature-value').textContent = `${temperature_2m[currentIndex]} °C`;
    document.querySelector('.rain-value').textContent = `${rain[currentIndex]} mm`;
    document.querySelector('.wind-speed-value').textContent = `${wind_speed_10m[currentIndex]} km/h`;
    document.querySelector('.snowfall-value').textContent = `${snowfall[currentIndex]} cm`;
    document.querySelector('.cloud-cover-value').textContent = `${cloud_cover[currentIndex]} %`;

    // Anzeige des Wetterbildes
    displayWeatherImage(rain[currentIndex], snowfall[currentIndex], wind_speed_10m[currentIndex], cloud_cover[currentIndex]);

    // Anzeige der Wettervorhersage für die nächsten 4 Tage
    displayForecast(time, temperature_2m, rain, snowfall, cloud_cover, wind_speed_10m);
  } catch (error) {
    console.error('Fehler:', error);
    document.querySelector('.temperature-value').textContent = 'Fehler';
    document.querySelector('.rain-value').textContent = 'Fehler';
    document.querySelector('.wind-speed-value').textContent = 'Fehler';
    document.querySelector('.snowfall-value').textContent = 'Fehler';
    document.querySelector('.cloud-cover-value').textContent = 'Fehler';
  }
}

// Funktion zur Anzeige des Wetterbildes
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

// Funktion zur Anzeige der Wettervorhersage für die nächsten 4 Tage
function displayForecast(timeData, tempData, rainData, snowData, cloudData, windData) {
  const forecastContainer = document.querySelector('.list_content ul');
  forecastContainer.innerHTML = '';

  // Filtern der Vorhersagen, um nur eine Vorhersage pro Tag zu erhalten
  const uniqueForecastDays = [];
  const fourDaysForecast = timeData.filter((_, index) => {
    const forecastDate = new Date(timeData[index]).getDate();
    if (!uniqueForecastDays.includes(forecastDate)) {
      uniqueForecastDays.push(forecastDate);
      return true;
    }
    return false;
  });

  // Anzeige der Vorhersage für die nächsten 4 Tage
  for (let i = 0; i < 4; i++) {
    const forecastIndex = i * 24;
    const forecastDate = new Date(timeData[forecastIndex]);
    const dayNameShort = daysShort[forecastDate.getDay()];

    const forecastItem = document.createElement('li');
    forecastItem.innerHTML = `
      <img src="images/cloud.png" alt="" class="weather_img_icon" />
      <span>${dayNameShort}</span>
      <span class="day_tem">${tempData[forecastIndex]} °C</span>
    `;
    forecastContainer.appendChild(forecastItem);
  }
}
