#Projektdokumentation Projekt IM2

##Tools

Hier sind die APIs, die in deinem Code verwendet wurden:

Nominatim API (OpenStreetMap): Diese API wird verwendet, um Koordinaten (Breitengrad und Längengrad) für einen gegebenen Standortnamen zu erhalten.

URL für die Standortsuche: https://nominatim.openstreetmap.org/search?q=${location}&format=json&limit=1
URL für die Umkehrgeokodierung: https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json

Open-Meteo API: Diese API wird verwendet, um Wetterdaten basierend auf den Koordinaten (Breitengrad und Längengrad) zu erhalten.

URL für die Wettervorhersage: https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,rain,snowfall,cloud_cover,wind_speed_10m&timezone=Europe%2FBerlin


##Learning

##Pains

##KI_Einsatz

ChatGPT 4.o

##Externe Quelle

