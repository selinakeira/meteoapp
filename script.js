/*

VERSION 1 VON YOUTUBE

"use strict";

// Elemente aus dem DOM auswählen
const dayEl = document.querySelector(".default_day");
const dateEl = document.querySelector(".defaul_date");
const inputEl = document.querySelector(".input_field");
const btnEl = document.querySelector(".btn_search");
const iconContainer = document.querySelector(".icons");
const dayInfoEl = document.querySelector(".day_info");
const anzeigen = document.querySelector(".anzeigen");

// Wochentage und Monate für die Anzeige
const days = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag","Sonntag"];
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
        const response = await fetch(latitude, longitude);
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
    // Bild-URL einfügen  
    iconContainer.innerHTML = `<img src="xxx" alt="" class="weather_img_icon"/> 
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


*/

// CODE VOM COCKTAIL-PROJEKT

let suche = document.querySelector('#suche');
let anzeige = document.querySelector('#anzeige');


// Funktion zum Abrufen von Cocktail-Daten
async function holeDaten(url) {
  try {
      let data = await fetch(url);
      return await data.json();
  } catch (e) {
      console.error(e);
  }
}

// Funktion zum Darstellen von Cocktail-Daten
function datenDarstellen(cocktails) {
  anzeige.innerHTML = '';
  cocktails.forEach(cocktail => {
      let div = document.createElement('div');
      let image = document.createElement('img'); 
      image.src = cocktail.strDrinkThumb;
      let title = document.createElement('h2');
      title.innerText = cocktail.strDrink;
      div.appendChild(title);
      div.appendChild(image);
      anzeige.appendChild(div);
  });
}

// Event-Listener für die Suche
suche.addEventListener('input', async function () {
  let ergebnis = suche.value;
  let searchUrl = 'https://www.thecocktaildb.com/api/json/v1/1/search.php?s=' + ergebnis;
  console.log(ergebnis);

  // Hole und zeige Daten basierend auf der Suchanfrage

  let cocktails_aus_suche = await holeDaten(searchUrl);
  datenDarstellen(cocktails_aus_suche.drinks);
  console.log (cocktails_aus_suche)
});

/*

VERSION 2 VON OPENMETEO DIREKT

$ curl "https://api.open-mhttps://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&current=temperature_2m,wind_speed_10m&hourly=temperature_2m,relative_humidity_2m,wind_speed_10meteo.com/v1/forecast?latitude=52.52&longitude=13.41&current=temperature_2m,wind_speed_10m&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m"

{
  "current": {
    "time": "2022-01-01T15:00",
    "temperature_2m": 2.4,
    "wind_speed_10m": 11.9
  },
  "hourly": {
    "time": ["2022-07-01T00:00", "2022-07-01T01:00", ...],
    "wind_speed_10m": [3.16, 3.02, 3.3, 3.14, 3.2, 2.95, ...],
    "temperature_2m": [13.7, 13.3, 12.8, 12.3, 11.8, ...],
    "relative_humidity_2m": [82, 83, 86, 85, 88, 88, 84, 76, ...]
  }
}

*/

