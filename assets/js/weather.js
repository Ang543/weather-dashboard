//global variables
var Temperature = $("#temperature");
var currentHumidty = $("#humidity");
var currentWindSpeed = $("#wind-speed");
var currentUvindex = $("#uv-index");
var search = $("#search");
var searchCity = $("#search-city");
var currentCity = $("#current-city");


//API key
var APIKey = "14a4c90d0510783f77b159bd26a8a101";

// Current and future weather
function displayWeather(event) {
  event.preventDefault();
    city = searchCity.val().trim();
    currentWeather(city);
  }

function currentWeather(city) {
  var queryURL =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    city +
    "&APPID=" +
    APIKey;
  $.ajax({
    url: queryURL,
    method: "GET",
  }).then(function (response) {
    // Weather, city, date, and weather icon
    console.log(response);
    var weathericon = response.weather[0].icon;
    var iconurl =
      "https://openweathermap.org/img/wn/" + weathericon + "@2x.png";
   
    new Date(response.dt * 1000).toLocaleDateString();
    
    $(currentCity).html(response.name + "<img src=" + iconurl + ">");
    // temperature in fahrenheit

    var tempF = (response.main.temp - 273.15) * 1.8 + 32;
    $(Temperature).html(tempF.toFixed(0) + "&#8457");
    // Humidity
    $(currentHumidty).html(response.main.humidity + "%");
    // Wind speed in MPH
    var ws = response.wind.speed;
    var windsmph = (ws * 2.237).toFixed(1);
    $(currentWindSpeed).html(windsmph + "MPH");
    // UVIndex.
    UVIndex(response.coord.lon, response.coord.lat);
    forecast(response.id);
    if (response.cod == 200) {
      sCity = JSON.parse(localStorage.getItem("cityname"));
      console.log(sCity);
      if (sCity == null) {
        sCity = [];
        sCity.push(city.toUpperCase());
      } else {
        if (find(city) > 0) {
          sCity.push(city.toUpperCase());
        }
      }
    }
  });
}
function UVIndex(ln, lt) {
  var uvqURL =
    "https://api.openweathermap.org/data/2.5/uvi?appid=" +
    APIKey +
    "&lat=" +
    lt +
    "&lon=" +
    ln;
  $.ajax({
    url: uvqURL,
    method: "GET",
  }).then(function (response) {
    $(currentUvindex).html(response.value);
  });
}

// 5 days forecast 
function forecast(cityid) {
  var queryforcastURL =
    "https://api.openweathermap.org/data/2.5/forecast?id=" +
    cityid +
    "&appid=" +
    APIKey;
  $.ajax({
    url: queryforcastURL,
    method: "GET",
  }).then(function (response) {
    for (i = 0; i < 5; i++) {
      var date = new Date(
        response.list[(i + 1) * 8 - 1].dt * 1000
      ).toLocaleDateString();
      var iconcode = response.list[(i + 1) * 8 - 1].weather[0].icon;
      var iconurl = "https://openweathermap.org/img/wn/" + iconcode + ".png";
      var tempatureKelvin = response.list[(i + 1) * 8 - 1].main.temp;
      var tempatureFahrenheit = ((tempatureKelvin - 273.5) * 1.8 + 32).toFixed(0);
      var humidity = response.list[(i + 1) * 8 - 1].main.humidity;
      $(".cards-container").addClass("card");
     
      $("#5DTemp" + i).html("Temp: " + tempatureFahrenheit + "&#8457");
      $("#5DDate" + i).html(date);
      $("#5DHumidity" + i).html("Humidity: " + humidity + "%");
      $("#5DImg" + i).html("<img src=" + iconurl + ">");
    }
  });
}

$("#search").on("click", displayWeather);