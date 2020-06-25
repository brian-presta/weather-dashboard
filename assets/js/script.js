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
    console.log(geoData)
    apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${geoData.lat}&lon=${geoData.lon}&exclude=minutely,hourly&appid=d1cd3159572faa76d674791448dcb10b`
    fetch(apiUrl)
    .then(function(response){
        if (response.ok) {
            response.json().then(function(data){
                console.log(data)
            })
        }
        else {
            alert("Unable to perform search")
        }
    })
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