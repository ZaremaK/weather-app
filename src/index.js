const api = {
    base: "https://api.openweathermap.org/data/2.5/",
    key: "261be960710adff4cf2620414d0a38ed"
}

let dates;
let apiUrl;
let temps;


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
    dates = { mainDate: mainDate, hours: hours }
    return dates;
}






function selectCity(event) {
    let searchInput = document.querySelector("#search-input");

    event.preventDefault();

    requestApi(searchInput.value)
   
}


let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", selectCity);

function requestApi(query) {
    apiUrl = `${api.base}weather?q=${query}&APPID=${api.key}`;
    getResults();
}
function geolocation() {
    navigator.geolocation.getCurrentPosition(onSuccess)
}

let currentCity = document.querySelector("#currentCity");
currentCity.addEventListener("click", geolocation);

function onSuccess(position) {
    const { latitude, longitude } = position.coords;
    apiUrl = `${api.base}weather?lat=${latitude}&lon=${longitude}&APPID=${api.key}`;
    getResults();
}

async function getResults() {
    fetch(apiUrl)
        .then(weather => {
            return weather.json();
        }).then(displayResultsMain);
    
}

function displayResultsMain(weather) {
    console.log(weather);
    const dateTime = new Date(weather.dt * 1000);
    const toUtc = dateTime.getTime() + dateTime.getTimezoneOffset() * 60000;
    const currentLocalTime = toUtc + 1000 * weather.timezone;
    let sunriseTime = new Date(weather.sys.sunrise * 1000);
    let sunsetTime = new Date(weather.sys.sunset * 1000);
    let letLocalSunrise = sunriseTime.toLocaleTimeString();
    let letLocalSunset = sunsetTime.toLocaleTimeString();

    let city = document.querySelector("#cityChange");
    let cityHeader = document.querySelector("#city-header");
    let tempCel = `${Math.round(weather.main.temp - 273.15)}`;
    let tempFar = `${Math.round((weather.main.temp - 273.15) * 1.8 + 32)}`;
    let tempCelMax = `${Math.round(weather.main.temp_max - 273.15)}`;
    let tempFarMax = `${Math.round((weather.main.temp_max - 273.15) * 1.8 + 32)}`;
    let tempCelMin = `${Math.round(weather.main.temp_min - 273.15)}`;
    let tempFarMin = `${Math.round((weather.main.temp_min - 273.15) * 1.8 + 32)}`;
    let tempCelFeel = `${Math.round(weather.main.feels_like - 273.15)}`;
    let tempFarFeel = `${Math.round((weather.main.feels_like - 273.15) * 1.8 + 32)}`;

    let temp = document.querySelector('#temp-now');
    let temperatureMin = document.querySelector("#tempMin");
    let temperatureMax = document.querySelector("#tempMax");
    let temperatureFeel = document.querySelector("#feelsLike");

    let h3Main = document.querySelector(".h3-main-form");
    let weatherIcon = document.querySelector(".main-fr-icon");
    let descriptionElement = document.querySelector("#description");

    let windElement = document.querySelector("#wind");
    let windMainGusts = document.querySelector("#windGusts");
    let sunriseElement = document.querySelector("#sunrise");
    let sunsetElement = document.querySelector("#sunset");
    let humidityElement = document.querySelector("#humidity");
    let cloudinessElement = document.querySelector("#cloudiness");




    city.innerHTML = `${weather.name}`;
    cityHeader.innerHTML = `${weather.name}`;
    temp.innerHTML = tempCel;
    temperatureMax.innerHTML = tempCelMax;
    temperatureMin.innerHTML = tempCelMin;
    temperatureFeel.innerHTML = tempCelFeel;
    
    formatMainDate(currentLocalTime);
    h3Main.innerHTML = dates.mainDate;
    descriptionElement.innerHTML = `${weather.weather[0].description}`;
    
    windElement.innerHTML = `${Math.round(weather.wind.speed)}`;
    windMainGusts.innerHTML = `${Math.round(weather.wind.gust)}`;
    humidityElement.innerHTML = `${(weather.main.humidity)}`;
    sunriseElement.innerHTML = letLocalSunrise;
    sunsetElement.innerHTML = letLocalSunset;
    cloudinessElement.innerHTML = `${Math.round(weather.clouds.all)}`;



    let idIcon = `${weather.weather[0].id}`;
 
    let time = dates.hours;
    if (time > 5 && time < 21) {

        document.body.style.backgroundImage = "url('image/pexels-miguel-padrin-19670.jpg')";
        if (idIcon == 800) {
            weatherIcon.src = "weather-oxygen-icon/weather-clear.png";
        } else if (idIcon >= 200 && idIcon <= 232) {
            weatherIcon.src = "weather-oxygen-icon/weather-storm-day.png";
        } else if (idIcon >= 300 && idIcon <= 321) {
            weatherIcon.src = "weather-oxygen-icon/weather-freezing-rain.png";
        } else if ((idIcon >= 600 && idIcon <= 602) || (idIcon >= 620 && idIcon <= 622)) {
            weatherIcon.src = "weather-oxygen-icon/weather-snow-scattered-day.png";
        } else if (idIcon >= 611 && idIcon <= 616) {
            weatherIcon.src = "weather-oxygen-icon/weather-snow-rain.png";
        } else if ((idIcon >= 701 && idIcon <= 781) || ((idIcon == 511))) {
            weatherIcon.src = "weather-oxygen-icon/weather-mist.png";
        } else if (idIcon == 801) {
            weatherIcon.src = "weather-oxygen-icon/weather-few-clouds.png";
        } else if ((idIcon == 802) || (idIcon == 803)) {
            weatherIcon.src = "weather-oxygen-icon/weather-clouds.png";
        } else if (idIcon == 804) {
            weatherIcon.src = "weather-oxygen-icon/weather-many-clouds.png";
        } else if ((idIcon == 500) || (idIcon == 520)) {
            weatherIcon.src = "weather-oxygen-icon/weather-showers-scattered-day.png";
        } else if (idIcon >= 501 && idIcon <= 504) {
            weatherIcon.src = "weather-oxygen-icon/weather-showers-day.png";
        } else if (idIcon >= 521 && idIcon <= 531) {
            weatherIcon.src = "weather-oxygen-icon/weather-showers.png";
        }
    } else {
        document.body.style.backgroundImage = "url('image/pexels-night.jpg')";
            if (idIcon == 800) {
                weatherIcon.src = "weather-oxygen-icon/weather-clear-night.png";
            } else if (idIcon >= 200 && idIcon <= 232) {
                weatherIcon.src = "weather-oxygen-icon/weather-storm-night.png";
            } else if (idIcon >= 300 && idIcon <= 321) {
                weatherIcon.src = "weather-oxygen-icon/weather-freezing-rain.png";
            } else if ((idIcon >= 600 && idIcon <= 602) || (idIcon >= 620 && idIcon <= 622)) {
                weatherIcon.src = "weather-oxygen-icon/weather-snow-scattered-night.png";
            } else if (idIcon >= 611 && idIcon <= 616) {
                weatherIcon.src = "weather-oxygen-icon/weather-snow-rain.png";
            } else if ((idIcon >= 701 && idIcon <= 781) || ((idIcon == 511))) {
                weatherIcon.src = "weather-oxygen-icon/weather-mist.png";
            } else if (idIcon == 801) {
                weatherIcon.src = "weather-oxygen-icon/weather-few-clouds-night.png";
            } else if ((idIcon == 802) || (idIcon == 803)) {
                weatherIcon.src = "weather-oxygen-icon/weather-clouds-night.png";
            } else if (idIcon == 804) {
                weatherIcon.src = "weather-oxygen-icon/weather-many-clouds.png";
            } else if ((idIcon == 500) || (idIcon == 520)) {
            weatherIcon.src = "weather-oxygen-icon/weather-showers-scattered-night.png";
            } else if (idIcon >= 501 && idIcon <= 504) {
                weatherIcon.src = "weather-oxygen-icon/weather-showers-night.png";
            } else if (idIcon >= 521 && idIcon <= 531) {
                weatherIcon.src = "weather-oxygen-icon/weather-showers.png";
    }
     
    }
          

    weatherIcon.innerHTML = weatherIcon.src;



    temps = {
        tempCel: tempCel, tempFar: tempFar, tempCelMax: tempCelMax, tempFarMax: tempFarMax,
        tempCelMin: tempCelMin, tempFarMin: tempFarMin, tempCelFeel: tempCelFeel,
        tempFarFeel: tempFarFeel
    }
    return temps;


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
    temperature.innerHTML = temps.tempFar;
    temperatureFarMax.innerHTML = temps.tempFarMax;
    temperatureFarMin.innerHTML = temps.tempFarMin;
    temperatureFarFeel.innerHTML = temps.tempFarFeel;

}


let changeTempCel = document.querySelector("#celsiusDegree");
changeTempCel.addEventListener("click", convertTempCel);
let changeTempFar = document.querySelector("#fahrenheitDegree");
changeTempFar.addEventListener("click", convertTempFar);

