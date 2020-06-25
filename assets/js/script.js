var geoEncode = function(city) {
    // the API endpoint we want to use to fetch actual weather data only takes latitude and longitude as search parameters,
    // so we're only using this one as a geo encoder
    apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=d1cd3159572faa76d674791448dcb10b`
    console.log(apiUrl)
    fetch(apiUrl)
    .then(function(response){
        if (response.ok) {
            response.json().then(function(data){
                var geoData = {
                    name:data.name,
                    lat:data.coord.lat,
                    lon:data.coord.lon
                }
                getWeatherData(geoData)
            })
        }
        else {
            alert("Unable to perform search")
        }
    })
}
var getWeatherData = function(geoData) {
    apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${geoData.lat}&lon=${geoData.lon}&exclude=minutely,hourly&units=imperial&appid=d1cd3159572faa76d674791448dcb10b`
    fetch(apiUrl)
    .then(function(response){
        if (response.ok) {
            response.json().then(function(data){
                console.log(data)
                drawWeatherData(geoData.name,data)
                
            })
        }
        else {
            alert("There was a problem fetching the weather data.")
        }
    })
}
var drawWeatherData = function(name,weatherData) {
    var currentData = weatherData.current
    var currentWeather = $("#current-weather")
    var uviData = currentData.uvi
    var uviSpan = currentWeather.find(".uvi")
    currentWeather.removeClass("invisible")
    currentWeather.find(".city").text(name)
    currentWeather.find(".date").text(moment().format("(M/DD/YYYY)"))
    currentWeather.find("img").attr('src',`https://openweathermap.org/img/wn/${currentData.weather[0].icon}.png`)
    currentWeather.find(".temperature").text(currentData.temp)
    currentWeather.find(".humidity").text(currentData.humidity)
    currentWeather.find(".speed").text(currentData.wind_speed)
    uviSpan.text(uviData)
    uviSpan.removeClass("bg-success bg-warning bg-danger text-white")
    if (uviData < 3) {
        uviSpan.addClass("bg-success text-white")
    }
    else if (uviData > 2 && uviData < 6) {
        uviSpan.addClass("bg-warning")
    } 
    else {
        uviSpan.addClass("bg-danger text-white")
    }
}
var cityFormHandler = function(event) {
    event.preventDefault()
    var input = $(this).find("input")
    var city = input.val()
    if (city) {
        geoEncode(city)
    }
    input.val('')
}
$("#city-form").on("submit",cityFormHandler)