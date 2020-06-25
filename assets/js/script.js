var geoEncode = function(city) {
    // the API endpoint we want to use to fetch actual weather data only accepts latitude and longitude as search parameters,
    // so we're only using this one to fetch coordinates for the city the user searched for
    apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=d1cd3159572faa76d674791448dcb10b`;
    fetch(apiUrl)
    .then(function(response){
        if (response.ok) {
            response.json().then(function(data){
                var geoData = {
                    name:data.name,
                    lat:data.coord.lat,
                    lon:data.coord.lon
                };
                // passes coordinates down the chain
                getWeatherData(geoData);
                // adds the city to the search history sidebar
                appendPreviousSearches(data.name);
            })
        }
        else {
            alert("Search was not successful.")
        }
    });
};
// gets weather data for the coordinates we captured earlier
var getWeatherData = function(geoData) {
    apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${geoData.lat}&lon=${geoData.lon}&exclude=minutely,hourly&units=imperial&appid=d1cd3159572faa76d674791448dcb10b`;
    fetch(apiUrl)
    .then(function(response){
        if (response.ok) {
            response.json().then(function(data){
                // passes weather data down the chain to be displayed
                drawWeatherData(geoData.name,data);
            })
        }
        else {
            alert("There was a problem fetching the weather data.")
        }
    });
};
// puts the weather data onto the page
var drawWeatherData = function(name,weatherData) {
    // draws the weather data for today to the page
    var currentData = weatherData.current;
    var currentWeather = $("#current-weather");
    var uviData = currentData.uvi;
    var uviSpan = currentWeather.find(".uvi");
    currentWeather.find(".city").text(name);
    currentWeather.find("img").attr('src',`https://openweathermap.org/img/wn/${currentData.weather[0].icon}.png`);
    currentWeather.find(".temperature").text(currentData.temp);
    currentWeather.find(".humidity").text(currentData.humidity);
    currentWeather.find(".speed").text(currentData.wind_speed);
    uviSpan.text(uviData);
    // removes any class on the span holding the UV index that might be left from earlier,
    // checks the value of of the UV index and adds an appropriate color coding class
    uviSpan.removeClass("bg-success bg-warning bg-danger text-white");
    if (uviData < 3) {
        uviSpan.addClass("bg-success text-white");
    }
    else if (uviData > 2 && uviData < 6) {
        uviSpan.addClass("bg-warning");
    } 
    else {
        uviSpan.addClass("bg-danger text-white");
    }
    // draws the weather data forecasted for the next five days to the page
    var forecastArray = weatherData.daily.slice(1,6); // 0 is today, slicing 1 to 6 gets us the next 5 days
    var currentIndex = 0;
    // iterate over the 5-day forecast cards and fill them out
    $(".weather-card").each(function(){
        var forecastData = forecastArray[currentIndex];
        var card = $(this);
        card.find("img").attr('src',`https://openweathermap.org/img/wn/${forecastData.weather[0].icon}.png`);
        card.find(".temperature").text(forecastData.temp.day);
        card.find(".humidity").text(forecastData.humidity);
        currentIndex++
    })
}
// adds a search term to search history
var appendPreviousSearches = function(name) {
    var newHistory = [name];
    var searchHistory = JSON.parse(localStorage.getItem("search-history"));
    if (searchHistory) {
        // adds the most recent term to the front of the array. We only want to preserve
        // 10 search terms, so if there are already 10 then the slice removes the oldest
        newHistory = newHistory.concat(searchHistory.slice(0,9));
    }
    localStorage.setItem("search-history",JSON.stringify(newHistory));
    drawSearchHistory();
}
// draws the stored search terms onto the page
var drawSearchHistory = function() {
    var history = JSON.parse(localStorage.getItem("search-history"));
    // escapes the function early if there's nothing to draw
    if (!history) {
        return;
    }
    // get a reference to the search history sidebar and empty it
    container = $("#previous-search-container");
    container.empty();
    // iterate through the search history and place each one onto the page
    history.forEach(city => {
        container.append(
            $("<div>")
            .text(city)
            .addClass("border-bottom border-muted p-3 previous-search")
        );
    });
    // removes the bottom border from the last element so that it doesn't overlap with the parent container's border
    $(".previous-search").last().removeClass("border-bottom border-muted");
}
// repeats a search if the user clicks on a search history button
var historyClickHandler = function(event) {
    geoEncode(event.target.textContent);
}
// handler for the search field and button
var cityFormHandler = function(event) {
    event.preventDefault();
    // gets the value of the textinput, passes it off to the first API call if it's not empty
    var input = $(this).find("input");
    var city = input.val();
    if (city) {
        geoEncode(city);
    }
    // clears out the textinput
    input.val('');
}
// fills out the date fields on the page
var drawDates = function() {
    // get todays date, iterate over the date fields and fill them out then increment the date
    today = moment();
    $(".date").each(function(){
        $(this).text(today.format("M/DD/YYYY"));
        today.add(1,'d');
    })
}
// functions to call on load
drawSearchHistory();
drawDates();
// listen for users submitting the search form
$("#city-form").on("submit",cityFormHandler);
// listen for users clicking on previous searches
$("#previous-search-container").on("click",historyClickHandler);