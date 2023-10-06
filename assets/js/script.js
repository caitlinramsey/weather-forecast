var myApiKey = "7869685bf7ac61c2e9b6bea2b3c4883f";
var requestURL = "https://api.openweathermap.org/data/2.5/weather?q=";
var oneCall = "https://api.openweathermap.org/data/3.0/onecall?lat=";
var searchHistory = $("#search-history");
var cityIconUrl = "http://openweathermap.org/img/wn/";
var loadResultsHistoryArray = loadResultsHistory();
var cityInput = $("#city");
var fiveDayForecast = $("#five-day-forecast");
var userInput = $("#search-city");
var currentDay = moment().format("M/DD/YYYY");
var column2El = $(".column2");

function capitalizeFirstLetter(str) {
  var lowercaseString = str.toLowerCase().split(" ");
  for (var i = 0; i < lowercaseString.length; i++) {
    lowercaseString[i] =
      lowercaseString[i].charAt(0).toUpperCase() +
      lowercaseString[i].substring(1);
  }

  return lowercaseString.join(" ");
}

function loadResultsHistory() {
  var loadResultsHistoryArray = JSON.parse(
    localStorage.getItem("search history")
  );

  if (!loadResultsHistoryArray) {
    loadResultsHistoryArray = {
      searchedForCity: [],
    };
  } else {
    for (var i = 0; i < loadResultsHistoryArray.searchedForCity.length; i++) {
      historyResults(loadResultsHistoryArray.searchedForCity[i]);
    }
  }

  return loadResultsHistoryArray;
}

function historyResults(city) {
  var searchBtn = $("<button>")
    .text(city)
    .addClass("btn")
    .on("click", function () {
      $("#current-weather").remove();
      $("#five-day-forecast").empty();
      $("#five-day-forecast-header").remove();
      getForecast(city);
    })
    .attr({
      type: "button",
    });

  searchHistory.append(searchBtn);
}

function saveResultsHistory() {
  localStorage.setItem(
    "search history",
    JSON.stringify(loadResultsHistoryArray)
  );
}

function getForecast(city) {
  var apiCoordinates = requestURL + city + "&appid=" + myApiKey;

  fetch(apiCoordinates)
    .then(function (requestCoord) {
      if (requestCoord.ok) {
        requestCoord.json().then(function (data) {
          var cityLat = data.coord.lat;
          var cityLon = data.coord.lon;

          var apiOneCall =
            oneCall +
            cityLat +
            "&lon=" +
            cityLon +
            "&appid=" +
            myApiKey +
            "&units=imperial";

          fetch(apiOneCall).then(function (forecastResponse) {
            if (forecastResponse.ok) {
              forecastResponse.json().then(function (weatherData) {
                var currentDayForecast = $("<div>").attr({
                  id: "current-weather",
                });
                var cityIcon = weatherData.current.weather[0].icon;
                var currentCityIcon = cityIconUrl + cityIcon + ".png";

                var forecastHeading = $("<h2>").text(
                  city + " (" + currentDay + ")"
                );
                var iconImage = $("<img>").attr({
                  id: "forecast-icon",
                  src: currentCityIcon,
                  alt: "Forecast Weather Icon",
                });

                var forecastList = $("<ul>");

                var forecastDetails = [
                  "Temperature: " + weatherData.current.temp + " °F",
                  "Wind: " + weatherData.current.wind_speed + " MPH",
                  "Humidity: " + weatherData.current.humidity + "%",
                ];

                for (var i = 0; i < forecastDetails.length; i++) {
                  var forecastListItem = $("<li>").text(forecastDetails[i]);

                  forecastList.append(forecastListItem);
                }

                $("#five-day-forecast").before(currentDayForecast);
                currentDayForecast.append(forecastHeading);
                forecastHeading.append(iconImage);
                currentDayForecast.append(forecastList);

                var fiveDayForecastHeading = $("<h2>")
                  .text("5-Day Forecast:")
                  .attr({
                    id: "five-day-forecast-header",
                  });

                $("#current-weather").after(fiveDayForecastHeading);

                var fiveDayForecastArray = [];

                for (var i = 0; i < 5; i++) {
                  let forecastDate = moment()
                    .add(i + 1, "days")
                    .format("M/DD/YYYY");

                  fiveDayForecastArray.push(forecastDate);
                }

                for (var i = 0; i < fiveDayForecastArray.length; i++) {
                  var cardCol = $("<div>").addClass("column3");

                  var cardBody = $("<div>").addClass("card-body");

                  var cardHeader = $("<h4>")
                    .addClass("card-header")
                    .text(fiveDayForecastArray[i]);

                  var weatherIcon = weatherData.daily[i].weather[0].icon;

                  var forecastIcon = $("<img>").attr({
                    src: cityIconUrl + weatherIcon + ".png",
                    alt: "Forecast Icon",
                  });

                  var forecastDetails = [
                    "Temperature: " + weatherData.current.temp + " °F",
                    "Wind: " + weatherData.current.wind_speed + " MPH",
                    "Humidity: " + weatherData.current.humidity + "%",
                  ];

                  var temperatureEl = $("<p>")
                    .addClass("card-text")
                    .text("Temperature: " + weatherData.daily[i].temp.max);

                  var windyEl = $("<p>")
                    .addClass("card-text")
                    .text("Wind: " + weatherData.daily[i].wind_speed + " MPH");

                  var humidityEl = $("<p>")
                    .addClass("card-text")
                    .text("Humidity: " + weatherData.daily[i].humidity + "%");

                  fiveDayForecast.append(cardCol);
                  cardCol.append(cardBody);
                  cardBody.append(cardHeader);
                  cardBody.append(forecastIcon);
                  cardBody.append(temperatureEl);
                  cardBody.append(windyEl);
                  cardBody.append(humidityEl);
                }
              });
            }
          });
        });
      } else {
        alert("Error: Could not find city.");
      }
    })

    .catch(function (error) {
      alert("Unable to connect.");
    });
}

userInput.on("submit", submitBtn);

function submitBtn(event) {
  event.preventDefault();

  var city = capitalizeFirstLetter(cityInput.val().trim());

  if (loadResultsHistoryArray.searchedForCity.includes(city)) {
    alert(
      city +
        " is included in the results below. Click the " +
        city +
        " button to get the weather forecast."
    );
    cityInput.val("");
  } else if (city) {
    getForecast(city);
    historyResults(city);
    loadResultsHistoryArray.searchedForCity.push(city);
    saveResultsHistory();
    cityInput.val("");
  } else {
    alert("Please enter a valid city.");
  }
}

$("#search-btn").on("click", function () {
  $("#current-weather").remove();
  $("#five-day-forecast").empty();
  $("#five-day-forecast-header").remove();
});
