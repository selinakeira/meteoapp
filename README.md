### Projektdokumentation Projekt IM2

Wir haben eine Wetterapp programmiert, mit der man einen Standort suchen kann und das Wetter für die nächsten 4 Tage sieht. Die App zeigt folgende Daten an: Temperatur, Windgeschwindigkeit, Regenmenge, Schneemenge und Wolkenmenge.

## Tools

Hier sind die APIs, die in unserem Code verwendet wurden:

- **Open-Meteo API**: Diese API wird hauptsächlich verwendet, um Wetterdaten basierend auf den Koordinaten (Breitengrad und Längengrad) zu erhalten.
  - URL für die Wettervorhersage: [https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,rain,snowfall,cloud_cover,wind_speed_10m&timezone=Europe%2FBerlin](https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,rain,snowfall,cloud_cover,wind_speed_10m&timezone=Europe%2FBerlin)

- **Nominatim API (OpenStreetMap)**: Diese API wird verwendet, um Koordinaten (Breitengrad und Längengrad) für einen gegebenen Standortnamen zu erhalten.
  - URL für die Standortsuche: [https://nominatim.openstreetmap.org/search?q=${location}&format=json&limit=1](https://nominatim.openstreetmap.org/search?q=${location}&format=json&limit=1)
  - URL für die Umkehrgeokodierung: [https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json](https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json)

## Learning

- **API-Integration**: Wir haben gelernt, wie man verschiedene APIs integriert und die Daten, die sie liefern, verarbeitet.
- **Asynchrone Programmierung**: Wir haben ein tieferes Verständnis für asynchrone Programmierung und die Verwendung von Promises und async/await in JavaScript gewonnen.
- **Fehlerbehebung und Debugging**: Durch zahlreiche Test- und Debugging-Sitzungen haben wir unsere Fähigkeiten zur Fehlerbehebung verbessert und gelernt, wie man effektive Debugging-Techniken anwendet.

## Pains

Wir haben oft mit der Responsiveness gekämpft. Es war eine Herausforderung, das Layout auf verschiedenen Bildschirmgrössen konsistent und benutzerfreundlich zu gestalten, und es hat nie ganz so funktioniert, wie wir es uns vorgestellt hatten.

## KI-Einsatz

Wir haben viel mit ChatGPT-4 gearbeitet, und es war sehr hilfreich. Die KI hat uns bei der Fehlersuche, der Verbesserung unseres Codes und der Optimierung von Funktionen unterstützt. Zudem haben wir auch teils mit dem GitHub Copilot gearbeitet.

## Externe Quellen

- **Nominatim API (OpenStreetMap)**: [https://nominatim.openstreetmap.org/ui/search.html](https://nominatim.openstreetmap.org/ui/search.html)
- **Open-Meteo API**: [https://open-meteo.com](https://open-meteo.com)