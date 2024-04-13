import { environments } from './config/environment.js';

const { weatherApiKey } = environments;

const location = document.getElementById('city');
const search = document.getElementById('search');
const temp = document.getElementById('temp');
const cityLabel = document.getElementById('city_label');

const getGeoLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      console.log(latitude, longitude);
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

const getWeather = async (city) => {
  const baseUrl = 'https://api.openweathermap.org/data/2.5/';
  const path = `weather?q=${city}&units=metric&appid=${weatherApiKey}&lang=pt_BR`;
  const url = `${baseUrl}${path}`;

  const res = await fetch(url);
  const data = await res.json();
  return data;
}

const showWeatherData = async (city) => {
  const weatherData = await getWeather(city);
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
  return `${tempFormatted}°C`;
}

function main() {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${-3.89065}&lon=${-38.6819}&appid=${weatherApiKey}`
  fetch(url)
    .then(res => res.json())
    .then(data => {
      console.log(data);
    })
    .catch(err => console.error(err));
} 

main();
getGeoLocation();