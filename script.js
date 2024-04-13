import { environments } from './config/environment.js';

const { weatherApiKey, apiUrl } = environments;

const location = document.getElementById('city');
const search = document.getElementById('search');
const temp = document.getElementById('temp');
const cityLabel = document.getElementById('city_label');

const getGeoLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      const path = `weather?lat=${latitude}&lon=${longitude}&appid=${weatherApiKey}`;
      showWeatherData(path);
    })
  }
}

const getCityName = () => {
  const city = location.value;
  if (!city) {
    alert('Digite o nome de uma cidade!');
    return;
  }
  showWeatherData(city);
}

search.addEventListener('click', getCityName);

const getWeather = async (info) => {
  const baseUrl = apiUrl;
  const path = info !== location.value 
    ? info 
    : `weather?q=${info}&units=metric&appid=${weatherApiKey}`;
  const url = `${baseUrl}${path}`;
  
  const res = await fetch(url);
  const data = await res.json();
  console.log(data);
  return data;
}

const showWeatherData = async (requestData) => {
  const weatherData = await getWeather(requestData);
  if ("cod" in weatherData && weatherData.cod === "404") {
    const errorMessage = `A cidade ${location.value} não foi encontrada!`;
    alert(errorMessage);
    location.value = '';
    return;
  };
  mountHTML(weatherData);
}

const mountHTML = (weatherData) => {
  temp.innerHTML = formatTemp(weatherData.main.temp);
  cityLabel.innerHTML = weatherData.name;
}

const formatTemp = (temp) => {
  const tempFormatted = temp.toFixed(0);
  if (tempFormatted.length >= 3) {
    const compressTemp = Math.floor(Number(tempFormatted) / 10);
    return `${compressTemp}°C`;
  };
  return `${tempFormatted}°C`;
}

getGeoLocation();