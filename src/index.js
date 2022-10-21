

const api = {
    base: "https://api.openweathermap.org/data/2.5/",
    key: "261be960710adff4cf2620414d0a38ed",
    forecast: "https://api.openweathermap.org/data/3.0/"
}

let dates;
let apiUrl;
let temps;
let idIcon;
let idIconMain;
let weatherIcon;

function formatMainDate(selectedDate) {
    let nowDate = new Date(selectedDate);
    let hours = nowDate.getHours();
    let minute = nowDate.getMinutes();
    let date = nowDate.getDate();
    let months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec"
    ];
    let month = months[nowDate.getMonth()];
    let dayNames = [
        "Sun",
        "Mon",
        "Tue",
        "Wed",
        "Thu",
        "Fri",
        "Sat"
    ];
    let day = dayNames[nowDate.getDay()];

    if (minute < 10) {
        minute = `0${minute}`
    }

    if (hours < 10) {
        hours = `0${hours}`
    }

    let mainDate = `${hours}:${minute}, ${date} ${month}, ${day} `;
    dates = { mainDate: mainDate, hours: hours, }
    return dates;
}

function formatDay(timestamp) {
    let date = new Date(timestamp * 1000);
    let day = date.getDay();
    let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return days[day];
}

function selectCity(event) {
    event.preventDefault();
    let searchInput = document.querySelector("#search-input");
    requestApi(searchInput.value)
}

function requestApi(query) {
    apiUrl = `${api.base}weather?q=${query}&units=metric&appid=${api.key}`;
    getResults();
}

function geolocation() {
    navigator.geolocation.getCurrentPosition(onSuccess)
}

function onSuccess(position) {
    const { latitude, longitude } = position.coords;
    apiUrl = `${api.base}weather?lat=${latitude}&lon=${longitude}&appid=${api.key}&units=metric`;
    getResults();
}

function getForecast(coordinates) {
    //console.log(coordinates);
    const latitude = coordinates.lat;
    const longitude = coordinates.lon;
    apiUrlForecast = `${api.forecast}onecall?lat=${latitude}&lon=${longitude}&exclude=minutely,alerts&units=metric&APPID=${api.key}`;
    getResultsForecast();
}

async function getResults() {
    axios.get(apiUrl).then(displayResultsMain);
}

async function getResultsForecast() {
    axios.get(apiUrlForecast).then(displayResultsForecast);
}

function displayResultsMain(weather) {
    //console.log(weather);
    const dateTime = new Date(weather.data.dt * 1000);
    const toUtc = dateTime.getTime() + dateTime.getTimezoneOffset() * 60000;
    const currentLocalTime = toUtc + 1000 * weather.data.timezone;
    let sunriseTime = new Date(weather.data.sys.sunrise * 1000);
    let sunsetTime = new Date(weather.data.sys.sunset * 1000);
    let letLocalSunrise = sunriseTime.toLocaleTimeString();
    let letLocalSunset = sunsetTime.toLocaleTimeString();

    let city = document.querySelector("#cityChange");
    let cityHeader = document.querySelector("#city-header");

    let tempCel = `${Math.round(weather.data.main.temp)}`;
    let tempCelMax = `${Math.round(weather.data.main.temp_max)}`;
    let tempCelMin = `${Math.round(weather.data.main.temp_min)}`;
    let tempCelFeel = `${Math.round(weather.data.main.feels_like)}`;


    let temp = document.querySelector('#temp-now');
    let temperatureMin = document.querySelector("#tempMin");
    let temperatureMax = document.querySelector("#tempMax");
    let temperatureFeel = document.querySelector("#feelsLike");

    let h3Main = document.querySelector(".h3-main-form");

    let descriptionElement = document.querySelector("#description");

    let windElement = document.querySelector("#wind");
    let windMainGusts = document.querySelector("#windGusts");
    let sunriseElement = document.querySelector("#sunrise");
    let sunsetElement = document.querySelector("#sunset");
    let humidityElement = document.querySelector("#humidity");
    let cloudinessElement = document.querySelector("#cloudiness");




    city.innerHTML = `${weather.data.name}`;
    cityHeader.innerHTML = `${weather.data.name}`;

    temp.innerHTML = tempCel;
    temperatureMax.innerHTML = tempCelMax;
    temperatureMin.innerHTML = tempCelMin;
    temperatureFeel.innerHTML = tempCelFeel;

    formatMainDate(currentLocalTime);
    let hours = Number(dates.hours);
    if (hours > 5 && hours < 21) {
        document.body.style.backgroundImage = "url('image/pexels-miguel-padrin-19670.jpg')";
    } else {
        document.body.style.backgroundImage = "url('image/pexels-night.jpg')";
    }
    h3Main.innerHTML = dates.mainDate;
    descriptionElement.innerHTML = `${weather.data.weather[0].description}`;

    windElement.innerHTML = `${Math.round(weather.data.wind.speed)}`;
    windMainGusts.innerHTML = `${Math.round(weather.data.wind.gust)}`;
    humidityElement.innerHTML = `${(weather.data.main.humidity)}`;
    sunriseElement.innerHTML = letLocalSunrise;
    sunsetElement.innerHTML = letLocalSunset;
    cloudinessElement.innerHTML = `${Math.round(weather.data.clouds.all)}`;


   

    getForecast(weather.data.coord);
    
    let mainIcon = getWeatherIcon(`${weather.data.weather[0].id}`);
    console.log(getWeatherIcon(idIconMain));
    document.querySelector("#main-icon").innerHTML = `<img src=${mainIcon} class="main-fr-icon" alt = "weather" />`;

    temps = {
        tempCel: tempCel, tempCelMax: tempCelMax, 
        tempCelMin: tempCelMin, tempCelFeel: tempCelFeel
    }
    return temps;
}

function displayResultsForecast(response) {
    
    const forecast = response.data.daily;

    let forecastDailyElement = document.querySelector("#forecast-dayly");
    let forecastDailyHTML = `<div class="row">`;

    forecast.forEach(function (forecastDay, index) {
        if (index < 6) {
            let tempDailyMax = Math.round(forecastDay.temp.max);
            let tempDailyMin = Math.round(forecastDay.temp.min);
            getWeatherIcon(`${forecastDay.weather[0].id}`);
            
            forecastDailyHTML =
                forecastDailyHTML +
                `
                <div class="col-2 forecast-weather">
                    
                        <div class="header">
                            <h5>${formatDay(forecastDay.dt)}</h5>
                        </div>
                        <img src=${weatherIcon}
                        class="card-img-top" id="img-daily"          
                        alt="weather"
                        width="42"
                        />
                        <div class="card-body">
                            <span id="temp-daily-max"><strong>${tempDailyMax}
                            &#176;</strong></span> <span id="temp-daily-min">/ ${tempDailyMin} &#176;</span>
                        </div>

                </div>
                 `;
        }
    });

    forecastDailyHTML = forecastDailyHTML + `</div>`;
    forecastDailyElement.innerHTML = forecastDailyHTML;

    const forecastHourly = response.data.hourly;
    const forecastTimezone = `${response.data.timezone_offset}`;

    let forecastHourlyElement = document.querySelector("#forecast-hourly");

    let forecastHourlyHTML = `<div class="row">`;

    for (var i = 0; i <= 20; i += 4) {
            getWeatherIcon(forecastHourly[i].weather[0].id);
        const dateTime = new Date(forecastHourly[i].dt * 1000);
            const toUtc = dateTime.getTime() + dateTime.getTimezoneOffset() * 60000;
            const currentLocalTime = toUtc + 1000 * forecastTimezone;

            forecastHourlyHTML =
                forecastHourlyHTML +
                `
      <div class="col-2 forecast-weather">
        <div class="header">
        <h5>${formatMainDate(currentLocalTime).hours}:00</h5></div>
        <img src=${weatherIcon}
          class="card-img-top" id="img-daily"          
          alt="weather"
          width="42"
        />
                    <div class="card-body">
                        <span class="card-text" ><strong>${Math.round(
                            forecastHourly[i].temp
                )} &#176;</strong></span>
                    </div>
      </div>
  `;
        
     }


    forecastHourlyHTML = forecastHourlyHTML + `</div>`;
    forecastHourlyElement.innerHTML = forecastHourlyHTML;
}

function getWeatherIcon(idIcon) {
    let time = Number(dates.hours);
    if (time > 5 && time < 21) {

        if (idIcon == 800) {
            weatherIcon = "weather-oxygen-icon/weather-clear.png";
        } else if (idIcon >= 200 && idIcon <= 232) {
            weatherIcon = "weather-oxygen-icon/weather-storm-day.png";
        } else if (idIcon >= 300 && idIcon <= 321) {
            weatherIcon = "weather-oxygen-icon/weather-freezing-rain.png";
        } else if ((idIcon >= 600 && idIcon <= 602) || (idIcon >= 620 && idIcon <= 622)) {
            weatherIcon = "weather-oxygen-icon/weather-snow-scattered-day.png";
        } else if (idIcon >= 611 && idIcon <= 616) {
            weatherIcon = "weather-oxygen-icon/weather-snow-rain.png";
        } else if ((idIcon >= 701 && idIcon <= 781) || ((idIcon == 511))) {
            weatherIcon = "weather-oxygen-icon/weather-mist.png";
        } else if (idIcon == 801) {
            weatherIcon = "weather-oxygen-icon/weather-few-clouds.png";
        } else if ((idIcon == 802) || (idIcon == 803)) {
            weatherIcon = "weather-oxygen-icon/weather-clouds.png";
        } else if (idIcon == 804) {
            weatherIcon = "weather-oxygen-icon/weather-many-clouds.png";
        } else if ((idIcon == 500) || (idIcon == 520)) {
            weatherIcon = "weather-oxygen-icon/weather-showers-scattered-day.png";
        } else if (idIcon >= 501 && idIcon <= 504) {
            weatherIcon = "weather-oxygen-icon/weather-showers-day.png";
        } else if (idIcon >= 521 && idIcon <= 531) {
            weatherIcon = "weather-oxygen-icon/weather-showers.png";
        }
    } else {
        
        if (idIcon == 800) {
            weatherIcon = "weather-oxygen-icon/weather-clear-night.png";
        } else if (idIcon >= 200 && idIcon <= 232) {
            weatherIcon = "weather-oxygen-icon/weather-storm-night.png";
        } else if (idIcon >= 300 && idIcon <= 321) {
            weatherIcon = "weather-oxygen-icon/weather-freezing-rain.png";
        } else if ((idIcon >= 600 && idIcon <= 602) || (idIcon >= 620 && idIcon <= 622)) {
            weatherIcon = "weather-oxygen-icon/weather-snow-scattered-night.png";
        } else if (idIcon >= 611 && idIcon <= 616) {
            weatherIcon.src = "weather-oxygen-icon/weather-snow-rain.png";
        } else if ((idIcon >= 701 && idIcon <= 781) || ((idIcon == 511))) {
            weatherIcon = "weather-oxygen-icon/weather-mist.png";
        } else if (idIcon == 801) {
            weatherIcon = "weather-oxygen-icon/weather-few-clouds-night.png";
        } else if ((idIcon == 802) || (idIcon == 803)) {
            weatherIcon = "weather-oxygen-icon/weather-clouds-night.png";
        } else if (idIcon == 804) {
            weatherIcon = "weather-oxygen-icon/weather-many-clouds.png";
        } else if ((idIcon == 500) || (idIcon == 520)) {
            weatherIcon = "weather-oxygen-icon/weather-showers-scattered-night.png";
        } else if (idIcon >= 501 && idIcon <= 504) {
            weatherIcon = "weather-oxygen-icon/weather-showers-night.png";
        } else if (idIcon >= 521 && idIcon <= 531) {
            weatherIcon = "weather-oxygen-icon/weather-showers.png";
        }

    }
    return weatherIcon;
}





function convertTempCel(event) {
    event.preventDefault();
    let temperature = document.querySelector("#temp-now");
    let temperatureCelMin = document.querySelector("#tempMin");
    let temperatureCelMax = document.querySelector("#tempMax");
    let temperatureCelFeel = document.querySelector("#feelsLike");
    temperature.innerHTML = temps.tempCel;
    temperatureCelMax.innerHTML = temps.tempCelMax;
    temperatureCelMin.innerHTML = temps.tempCelMin;
    temperatureCelFeel.innerHTML = temps.tempCelFeel;
}

function convertTempFar(event) {
    event.preventDefault();
    let temperature = document.querySelector("#temp-now");
    let temperatureFarMin = document.querySelector("#tempMin");
    let temperatureFarMax = document.querySelector("#tempMax");
    let temperatureFarFeel = document.querySelector("#feelsLike");
    let temperatureFarMaxDaily = document.querySelector("#temp-daily-max");
    temperature.innerHTML = Math.round((temps.tempCel) * 1.8 + 32);
    temperatureFarMax.innerHTML = Math.round((temps.tempCelMax) * 1.8 + 32);
    temperatureFarMin.innerHTML = Math.round((temps.tempCelMin) * 1.8 + 32); 
    temperatureFarFeel.innerHTML = Math.round((temps.tempCelFeel) * 1.8 + 32);
    temperatureFarMaxDaily.innerHTML = Math.round((tempDailyMax) * 1.8 + 32);
}

let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", selectCity);

let currentCity = document.querySelector("#currentCity");
currentCity.addEventListener("click", geolocation);




let changeTempCel = document.querySelector("#celsiusDegree");
changeTempCel.addEventListener("click", convertTempCel);
let changeTempFar = document.querySelector("#fahrenheitDegree");
changeTempFar.addEventListener("click", convertTempFar);


requestApi("Kyiv");

