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

// Eventlistener für das Suchformular
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
        getLocationName(latitude, longitude);
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

// Funktion zum Abrufen des Standorts basierend auf den Koordinaten
async function getLocationName(lat, lon) {
  try {
    const API_URL = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`;
    const response = await fetch(API_URL);
    const data = await response.json();

    const locationName = data.address.city || data.address.town || data.address.village || data.address.state || "Dein Standort";
    fetchWeatherData(lat, lon, locationName);
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
    const currentTemperature = temperature_2m[currentIndex];
    const currentRain = rain[currentIndex];
    const currentWindSpeed = wind_speed_10m[currentIndex];
    const currentSnowfall = snowfall[currentIndex];
    const currentCloudCover = cloud_cover[currentIndex];
    document.querySelector('.temperature-value').textContent = `${currentTemperature} °C`;
    document.querySelector('.rain-value').textContent = `${currentRain} mm`;
    document.querySelector('.wind-speed-value').textContent = `${currentWindSpeed} km/h`;
    document.querySelector('.snowfall-value').textContent = `${currentSnowfall} cm`;
    document.querySelector('.cloud-cover-value').textContent = `${currentCloudCover} %`;

    // Anzeige des Wetterbildes
    displayWeatherImage(currentRain, currentSnowfall, currentWindSpeed, currentCloudCover);

    // Anzeige der Wettervorhersage für die nächsten 4 Tage
    console.log(time)
    console.log(temperature_2m)
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

  if (wind >= 50) {
    imageUrl = 'images/wind_icon.webp';
  } else if (rain > 1) {
    imageUrl = 'images/regen_icon.webp';
  } else if (snow > 1) {
    imageUrl = 'images/schnee_icon.webp';
  } else if (cloud > 75) {
    imageUrl = 'images/wolken_icon.webp';
  } else if (cloud > 50) {
    imageUrl = 'images/sonnewolken_icon.webp';
  } else {
    imageUrl = 'images/sonne_icon.webp';
  }
  

  weatherImage.src = imageUrl;
  weatherImage.style.display = 'block';
}

// Funktion zur Anzeige der Wettervorhersage für die nächsten 4 Tage
function displayForecast(timeData, tempData, rainData, snowData, cloudData, windData) {
  const forecastContainer = document.querySelector('.list_content ul');
  forecastContainer.innerHTML = '';

  // Anzeige der Vorhersage für die nächsten 4 Tage
  for (let i = 0; i < 4; i++) {
    const forecastIndex = i * 24;
    const forecastDate = new Date(timeData[forecastIndex]);
    const dayNameShort = daysShort[forecastDate.getDay()];

    let averageTemp = 0;
    for (let j = 0; j < 24; j++) {
      averageTemp += tempData[forecastIndex + j];
    }
    averageTemp = Math.round((averageTemp / 24) * 10) / 10;

    let iconUrl = '';
    if (windData[forecastIndex] >= 62) {
      iconUrl = 'images/wind_icon.webp';
    } else if (rainData[forecastIndex] > 1) {
      iconUrl = 'images/regen_icon.webp';
    } else if (snowData[forecastIndex] > 1) {
      iconUrl = 'images/schnee_icon.webp';
    } else if (cloudData[forecastIndex] > 75) {
      iconUrl = 'images/wolken_icon.webp';
    } else if (cloudData[forecastIndex] > 50) {
      iconUrl = 'images/sonnewolken_icon.webp';
    } else {
      iconUrl = 'images/sonne_icon.webp';
    }

    const forecastItem = document.createElement('li');
    forecastItem.innerHTML = `
      <img src="${iconUrl}" alt="" class="weather_img_icon" />
      <span>${dayNameShort}</span>
      <span class="day_tem">${averageTemp} °C</span>
    `;
    forecastContainer.appendChild(forecastItem);
  }
}
