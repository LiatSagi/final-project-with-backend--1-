// MapHandler.js

import L from "leaflet";
import "leaflet-control-geocoder/dist/Control.Geocoder.css";
import "leaflet-control-geocoder/dist/Control.Geocoder.js";
import "leaflet/dist/leaflet.css";

export const initializeMap = (setLocation, setMapInitialized) => {
  const map = L.map("map", {
    maxZoom: 15 // Set the maximum zoom level
  }).setView([32.0853, 34.7818], 13);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors",
  }).addTo(map);

  const locationIcon = L.icon({
    iconUrl: 'location-icon.png',
    iconSize: [32, 32], // Set the icon size
    iconAnchor: [16, 32], // Set the icon anchor
  });

  let locationMarker = null;

  map.on('click', function (e) {
    const latlng = e.latlng;
    const geocoder = L.Control.Geocoder.nominatim();

    geocoder.reverse(latlng, map.options.crs.scale(map.getZoom()), function (results) {
      const address = results[0].name;
      const country = results[0].properties.address.country;

      if (country !== 'Israel' && country !== "ישראל" && country !== "השטחים הפלסטיניים") {
        alert('הכתובת שבחרת לא נמצאת בישראל. אנא בחר כתובת בישראל.');
        return;
      }

      const splitAddress = address.split(','); // Split the address by comma
      const city = splitAddress[0].trim();
      const street = splitAddress[1].trim();
      const area = splitAddress[2].trim();
      setLocation(`${city}, ${street}, ${area}`);

      // Check if the location marker already exists
      if (!locationMarker) {
        // Create a new location marker
        locationMarker = L.marker(latlng, { icon: locationIcon }).addTo(map);
      } else {
        // Update the location marker position
        locationMarker.setLatLng(latlng);
      }

      // Bind a popup to the location marker with the address
      locationMarker.bindPopup(address).openPopup();

      // Update the map view to the selected location
      map.setView(latlng, map.getZoom());
    });
  });

  // Add the geocoding control
  const geocoder = L.Control.Geocoder.nominatim();
  const control = L.Control.geocoder({
    geocoder: geocoder,
  }).addTo(map);

  // Add event listener for selecting a location using the geocoding control
  control.on("markgeocode", function (e) {
    const country = e.geocode.properties.address.country;
    if (country !== 'Israel' && country !== "ישראל" && country !== "השטחים הפלסטיניים") {
      alert('הכתובת שנבחרה אינה בישראל. אנא בחר כתובת בישראל.');
      return;
    }

    const addressComponents = e.geocode.properties.address;
    const area = addressComponents.residential || addressComponents.town || addressComponents.state_district || addressComponents.city;
    const city = addressComponents.suburb || addressComponents.city || addressComponents.town;
    const street = addressComponents.road || addressComponents.village || addressComponents.town || addressComponents.city;
    const address = `${street}, ${city}, ${area}`;
    setLocation(address);
    map.setView(e.geocode.center, map.getZoom());

    // Check if the location marker already exists
    if (!locationMarker) {
      // Create a new location marker
      locationMarker = L.marker(e.geocode.center, { icon: locationIcon }).addTo(map);
    } else {
      // Update the location marker position
      locationMarker.setLatLng(e.geocode.center);
    }

    // Bind a popup to the location marker with the address
    locationMarker.bindPopup(address).openPopup();
  });

  return map;
};