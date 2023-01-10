"use strict";

const apiKey = "at_SQ2YPNBbRxw1cx3rU2QLwBHMsHyFi";
const errorMsg = document.querySelector(".error-msg");
const btn = document.querySelector(".search__btn");
const searchInput = document.querySelector(".search__input");

const ip = document.querySelector(".data__value--ip");
const isp = document.querySelector(".data__value--isp");
const country = document.querySelector(".data__value--location");
const timeZone = document.querySelector(".data__value--time-zone");
const postalCode = document.querySelector(".data__value--postal-code");
const latitude = document.querySelector(".data__value--latitude");
const longitude = document.querySelector(".data__value--longitude");

const renderError = function (msg) {
  errorMsg.insertAdjacentText("beforeend", msg);
  setTimeout(() => {
    errorMsg.textContent = "";
  }, 3000);
};

const map = L.map("map");

L.tileLayer("https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

let markerIcon;
// Map view by coords(lat/lng)
const updateCoords = (coords) => {
  map.setView(coords, 16);

  // If marker icon is on the map (marker icon not null), we remove it, if there is we render marker icon.(this happens when we render a web page for the firs time)
  if (markerIcon != null && markerIcon != undefined) markerIcon.remove();
  // We update marker icon coords (lat/lng) and add on the map
  markerIcon = L.marker(coords);
  markerIcon.addTo(map);
};

const renderData = (data) => {
  ip.innerHTML = data.ip || "N/A";
  isp.innerHTML = data.isp || "N/A";
  country.innerHTML = data.location.country || "N/A";
  timeZone.innerHTML = data.location.timezone || "N/A";
  postalCode.innerHTML = data.location.postalCode || "N/A";
  latitude.innerHTML = data.location.lat || "N/A";
  longitude.innerHTML = data.location.lng || "N/A";
  const { lat, lng } = data.location;
  const coords = [lat, lng];
  console.log(coords);
  updateCoords(coords);
};

const regexCheckIp =
  /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

const inputData = async (inputValue = "", searchType = "ip") => {
  try {
    const url =
      searchType === "ip"
        ? `https://geo.ipify.org/api/v2/country,city?apiKey=${apiKey}&ipAddress=${inputValue}`
        : `https://geo.ipify.org/api/v2/country,city?apiKey=${apiKey}&&domain=${inputValue}`;
    console.log(url);

    const response = await fetch(url);
    if (!response.ok)
      throw new Error("Please enter a valid IP address or domain");
    const data = await response.json();
    console.log(data);
    renderData(data);
  } catch (error) {
    console.error(`${error}`);
    renderError(`${error.message}. Check your internet connection.`);
  }
};

inputData();

const getPosition = () => {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};

const whereAmI = async () => {
  try {
    const position = await getPosition();
    const { latitude: lat, longitude: lng } = position.coords;
    const myCoords = [lat, lng];
    updateCoords(myCoords);
  } catch (error) {
    console.error(error);
    renderError(`${error.message}`);
  }
};
whereAmI();

//  Enter/Check input value --START--
function inputValue(e) {
  e.preventDefault();
  if (searchInput.value.match(regexCheckIp)) {
    inputData(searchInput.value, "ip");
  } else {
    inputData(searchInput.value, "domain");
  }
  return;
}

btn.addEventListener("click", inputValue);

searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    btn.click();
  }
});
//  Enter/Check input value --END--
