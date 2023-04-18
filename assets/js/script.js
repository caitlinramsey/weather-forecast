var myApiKey = '7869685bf7ac61c2e9b6bea2b3c4883f';
var requestURL = 'https://api.openweathermap.org/data/2.5/weather?q=';
var oneCall = 'https://api.openweathermap.org/data/2.5/onecall?lat='
var searchHistory = $('#search-history');
var loadResultsHistoryArray = loadResultsHistory();
var cityInput = $('#city');
var fiveDayForecast = $('#five-day-forecast');
var userInput = $('#search-city');
var currentDay = moment().format('M/DD/YYYY');
var column2El = $('.column2'); 

function capitalizeFirstLetter(str) {
    var lowercaseString = str.toLowerCase().split(' ');
    for (var i = 0; i < lowercaseString.length; i++) {
        lowercaseString[i] = lowercaseString[i].charAt(0).toUppercase() + lowercaseString[i].subString(1);
    }

    return lowercaseString.join(' ');
}

function loadResultsHistory() {
    var loadResultsHistoryArray = JSON.parse(localStorage.getItem('search history'));

    if (!loadResultsHistoryArray) {
        loadResultsHistoryArray = {
            searchedForCity: [],
        };
    } else {
        for (var i = 0; i < loadResultsHistoryArray.searchedForCity.length; i++) {
            resultsHistory(loadResultsHistoryArray.searchedForCity[i]);
        }
    }

    return loadResultsHistoryArray;
} 

function saveResultsHistory() {
    localStorage.setItem('search history', JSON.stringify(loadResultsHistoryArray));
};

function historyResults(city) {
    var searchBtn = $('<button>')
        .text(city)
        .addClass('btn')
        .on('click', function () {
            $('#current-weather').remove();
            $('#five-day-forecast').empty();
            $('#five-day-forecast-header').remove();
            getForecast(city);
        })
        .attr({
            type: 'button'
        });

    searchHistory.append(searchBtn);
}

function getForecast(city) {
    var apiCoordinates = requestURL + city + '&appid=' + myApiKey;

    fetch(apiCoordinates)
        .then(function (requestCoord) {
            if (requestCoord.ok) {
                requestCoord.json().then(function (data) {
                    var cityLat = data.coord.lat;
                    var cityLon = data.coord.lon;

                    var apiOneCall = oneCall + cityLat + '&lon=' + cityLon + '&appid=' + myApiKey + '&units=imperial';

                    fetch(apiOneCall)
                        .then(function (forecastResponse) {
                            if (forecastResponse.ok) {
                                forecastResponse.json().then(function (weatherData) {
                                    var currentDayForecast = $('div')
                                        .attr({
                                            id: 'current-weather'
                                        })
                                })
                            }
                        })
                })
            }
        })
}