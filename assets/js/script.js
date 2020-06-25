var geoEncode = function(city) {
    apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=d1cd3159572faa76d674791448dcb10b`
    console.log(apiUrl)
    fetch(apiUrl)
    .then(function(response){
        if (response.ok) {
            response.json().then(function(data){
                var geoInfo = {
                    name:data.name,
                    lat:data.coord.lat,
                    lon:data.coord.lon
                }
                console.log(geoInfo)
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