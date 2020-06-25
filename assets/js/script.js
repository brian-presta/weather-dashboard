var geoEncode = function(city) {
    // the API endpoint we want to use to fetch actual weather data only takes latitude and longitude as search parameters,
    // so we're only using this one as a geo encoder
    apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=d1cd3159572faa76d674791448dcb10b`
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
                appendPreviousSearches(data.name)
            })
        }
        else {
            alert("Unable to perform search.")
        }
    })
}
var getWeatherData = function(geoData) {
    apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${geoData.lat}&lon=${geoData.lon}&exclude=minutely,hourly&units=imperial&appid=d1cd3159572faa76d674791448dcb10b`
    fetch(apiUrl)
    .then(function(response){
        if (response.ok) {
            response.json().then(function(data){
                drawWeatherData(geoData.name,data)
            })
        }
        else {
            alert("There was a problem fetching the weather data.")
        }
    })
}
var drawWeatherData = function(name,weatherData) {
    // draws the current weather data to the page
    var currentData = weatherData.current
    var currentWeather = $("#current-weather")
    var uviData = currentData.uvi
    var uviSpan = currentWeather.find(".uvi")
    currentWeather.removeClass("transparent")
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
    // draws the forecasted weather data to the page
    var forecastArray = weatherData.daily.slice(1,6)
    var currentIndex = 0
    $(".weather-card").each(function(){
        var forecastData = forecastArray[currentIndex]
        var card = $(this)
        card.find(".date").text(moment.unix(forecastData.dt).format("M/DD/YYYY"))
        card.find("img").attr('src',`https://openweathermap.org/img/wn/${forecastData.weather[0].icon}.png`)
        card.find(".temperature").text(forecastData.temp.day)
        card.find(".humidity").text(forecastData.humidity)
        currentIndex++
    })
    $("#weather-card-container").removeClass("transparent")
}
var appendPreviousSearches = function(name) {
    var newHistory = [name]
    var searchHistory = JSON.parse(localStorage.getItem("search-history"))
    if (searchHistory) {
        newHistory = newHistory.concat(searchHistory.slice(0,9))
    }
    localStorage.setItem("search-history",JSON.stringify(newHistory))
    drawSearchHistory()
}
var drawSearchHistory = function() {
    var history = JSON.parse(localStorage.getItem("search-history"))
    if (!history) {
        return
    }
    container = $("#previous-search-container")
    container.empty()
    history.forEach(city => {
        container.append(
            $("<div>").text(city).addClass("border-bottom border-muted p-3 previous-search")
        )
    });
    $(".previous-search").last().removeClass("border-bottom border-muted")
}
var historyClickHandler = function(event) {
    geoEncode(event.target.textContent)
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
$("#previous-search-container").on("click",historyClickHandler)
drawSearchHistory()