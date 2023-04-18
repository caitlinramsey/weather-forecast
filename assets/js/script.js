var input = document.createElement('input');
input.type - 'text';
CSSContainerRule.appendChild(input);

function getApi() {
    var requestURL = "api.openweathermap.org/data/2.5/forecast?q=Raleigh,us&appid=7869685bf7ac61c2e9b6bea2b3c4883f";
}

fetch(requestURL)
    .then(function (response) {
        return.response.json();
    })