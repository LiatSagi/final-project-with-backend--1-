// MapHandler.js

import L from "leaflet";
import "leaflet-control-geocoder/dist/Control.Geocoder.css";
import "leaflet-control-geocoder/dist/Control.Geocoder.js";
import "leaflet/dist/leaflet.css";

export const initializeMap = (setLocation, setMapInitialized) => {
  // Create a Leaflet map instance
  const map = L.map("map", {
    maxZoom: 15 // Set the maximum zoom level
  }).setView([32.0853, 34.7818], 13);// Set the initial view and zoom leve
    // Add a tile layer from OpenStreetMap
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors",
  }).addTo(map);

  // Define a custom location icon
  const locationIcon = L.icon({
    iconUrl: 'https://cdn.jsdelivr.net/npm/leaflet@1.7.1/dist/images/marker-icon.png',
    iconSize: [22, 22], // Set the icon size
    iconAnchor: [16, 12], // Set the icon anchor
  });
// Initialize a variable to hold the location marker
  let locationMarker = null;
// Event listener for clicking on the map
  map.on('click', function (e) {
    const latlng = e.latlng;
    const geocoder = L.Control.Geocoder.nominatim();
    // Reverse geocode the clicked coordinates to get address details
    geocoder.reverse(latlng, map.options.crs.scale(map.getZoom()), function (results) {
      const address = results[0].name;
      const country = results[0].properties.address.country;
    // Check if the selected location is in Israel
      if (country !== 'Israel' && country !== "ישראל" && country !== "השטחים הפלסטיניים") {
        alert("הכתובת שנבחרה אינה בישראל. אנא בחר כתובת בישראל.");
        return;
      }

      // Parse the address components
      const splitAddress = address.split(','); // Split the address by comma
      // Check if the splitAddress array has less than 2 items
      if (splitAddress.length < 2) {
        alert('אנא בחר כתובת עם לפחות 2 רכיבים (לדוגמה: רחוב ועיר).');
        return;
      }
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
    // Check if the selected location is in Israel
    if (country !== 'Israel' && country !== "ישראל" && country !== "השטחים הפלסטיניים") {
      alert('הכתובת שנבחרה אינה בישראל. אנא בחר כתובת בישראל.');
      return;
    }
    // Extract address components
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

  return map;// Return the initialized map instance
};
