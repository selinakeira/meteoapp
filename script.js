/*

"use strict";

const dayEl = document.querySelector(".default_day");
const dateEl = document.querySelector(".defaul_date");
const inputEl = document.querySelector(".input_field");
const btnEl = document.querySelector(".btn_search");
const iconContainer = document.querySelector(".icons");
const dayInfoEl = document.querySelector(".day_info");

// API-Schlüssel für OpenWeatherMap
const API = "7308a76037a59eb904a484dcf22e273f";

// Wochentage für die Anzeige
const days = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag","Sonntag"];

// Aktuellen Tag und Datum festlegen und anzeigen
const day = new Date();
const dayName = days[day.getDay()];
dayEl.textContent = dayName;
let month = day.toLocaleString("default", { month: "long" });
let date = day.getDate();
let year = day.getFullYear();
dateEl.textContent = date + " " + month + " " + year;

// Suchknopf Ereignis
btnEl.addEventListener("click", (e) => {
  e.preventDefault();
  if (inputEl.value !== "") {
    const Search = inputEl.value;
    inputEl.value = "";
    findLocation(Search);
  } else {
    alert("Bitte geben Sie den Namen der Stadt, des Landes ein!");
  }
});

// Funktion zum Abrufen des aktuellen Wetters
async function findLocation(name) {
  try {
    iconContainer.innerHTML = "";
    dayInfoEl.innerHTML = "";
    const API_URL = `https://api.openweathermap.org/data/2.5/weather?q=${name}&appid=${API}`;
    const data = await fetch(API_URL);
    const result = await data.json();

    if (result.cod !== "404") {
      const displayImageContent = imgContent(result);
      const sideContent = displaySideContent(result);

      setTimeout(() => {
        iconContainer.insertAdjacentHTML("afterbegin", displayImageContent);
        dayInfoEl.insertAdjacentHTML("afterbegin", sideContent);
        iconContainer.classList.add("fadeIn");
        dayInfoEl.classList.add("fadeIn");
      }, 1500);
    } else {
      const Message = `<h2 class="weather_temp">${result.cod}</h2>
                       <h3 class="cloudtxt">${result.message}</h3>`;
      iconContainer.insertAdjacentHTML("afterbegin", Message);
    }
  } catch (error) {}
}

// Funktion zur Anzeige von Wetterbild und Temperatur
function imgContent(resultData) {
  return `<img src="https://openweathermap.org/img/wn/${resultData.weather[0].icon}@4x.png" alt=""/>
          <h2 class="weather_temp">${Math.round(resultData.main.temp - 275.15) + "°C"}</h2>
          <h3 class="cloudtxt">${resultData.weather[0].description}</h3>`;
}

// Funktion zur Anzeige von weiteren Wetterinformationen
function displaySideContent(data) {
  return `<div class="content">
            <p class="title">Standort</p>
            <span class="value-1">${data.name}</span>
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
          </div>`;
}


*/


"use strict";

// Elemente aus dem DOM auswählen
const dayEl = document.querySelector(".default_day");
const dateEl = document.querySelector(".defaul_date");
const inputEl = document.querySelector(".input_field");
const btnEl = document.querySelector(".btn_search");
const iconContainer = document.querySelector(".icons");
const dayInfoEl = document.querySelector(".day_info");

// Wochentage und Monate für die Anzeige
const days = ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"];
const months = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];

// Aktuellen Tag und Datum anzeigen
const currentDate = new Date();
dayEl.textContent = days[currentDate.getDay()];
dateEl.textContent = `${currentDate.getDate()} ${months[currentDate.getMonth()]} ${currentDate.getFullYear()}`;

// API-Endpunkt und Schlüssel
const API_BASE_URL = "https://api.open-meteo.com/v1/forecast";

// Ereignishandler für den Suchknopf
btnEl.addEventListener("click", (e) => {
  e.preventDefault();

// Validierung, dass die Eingabe das korrekte Format hat (zwei durch Komma getrennte Werte)
  const coordinates = inputEl.value.split(",");
  if (coordinates.length === 2) {
      const latitude = coordinates[0].trim();
      const longitude = coordinates[1].trim();

// Weitere Validierung, dass Breite und Länge gültige Zahlen sind
      if (!isNaN(latitude) && latitude && !isNaN(longitude) && longitude) {
          fetchWeatherData(latitude, longitude);
          inputEl.value = ""; 
        
}}});


// Funktion zum Abrufen der Wetterdaten
async function fetchWeatherData(latitude, longitude) {
    const url = `${API_BASE_URL}?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,relative_humidity_2m,rain,snowfall,cloud_cover,wind_speed_10m&forecast_days=1`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.hourly) {
            updateWeatherDisplay(data.hourly);
        } else {
            throw new Error("Keine Daten verfügbar");
        }
    } catch (error) {
        console.error("Fehler beim Abrufen der Wetterdaten: ", error);
        alert("Fehler beim Abrufen der Wetterdaten: " + error.message);
    }
}

// Funktion zur Anzeige der Wetterdaten
function updateWeatherDisplay(hourlyData) {
    const hourIndex = new Date().getHours(); // aktuelle Stunde als Index

    const temperature = hourlyData.temperature_2m[hourIndex];
    const humidity = hourlyData.relative_humidity_2m[hourIndex];
    const cloudCover = hourlyData.cloud_cover[hourIndex];
    const windSpeed = hourlyData.wind_speed_10m[hourIndex];

    // Elemente im DOM aktualisieren
    iconContainer.innerHTML = `<img src="https://openweathermap.org/img/wn/10d@4x.png" alt="" class="weather_img_icon"/>
                               <h2 class="weather_temp">${temperature} °C</h2>
                               <h3 class="cloudtxt">Wolkenbedeckung: ${cloudCover}%</h3>`;

    dayInfoEl.innerHTML = `<div class="content">
                               <p class="title">Temperatur</p>
                               <span class="value-1">${temperature} °C</span>
                           </div>
                           <div class="content">
                               <p class="title">Luftfeuchtigkeit</p>
                               <span class="value-2">${humidity}%</span>
                           </div>
                           <div class="content">
                               <p class="title">Windgeschwindigkeit</p>
                               <span class="value-2">${windSpeed} km/h</span>
                           </div>`;
}
