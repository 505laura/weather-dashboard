// API key for openweathermap
const key = 'e45a73480beb9e2bd5f0d93532fd4564';

// Storing data about the cities that have been searched recently
let recentlySearched = [];

// Get recently searched cities from local storage
function getRecents() {
    recentlySearched = JSON.parse(localStorage.getItem('recentlySearched') || '[]').slice(0, 5);
}

// Save recently searched cities to local storage
function saveRecents() {
    recentlySearched = recentlySearched.slice(0, 5);
    localStorage.setItem('recentlySearched', JSON.stringify(recentlySearched));
}

// Fill in one card with the data for that day
function populateCard(card, data) {
    const today = $(card);
    today.children('.date').text(moment(data.dt_txt).format('MMM Do'));
    // Get the icon for the weather from the openweathermap url
    today.children('.card-img-bottom').attr('src', `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`);
    today.children('.weather').children('span').text(data.weather[0].main);

    today.children('.temp').children('span').text(data.main.temp);
    today.children('.wind').children('span').text(data.wind.speed);
    today.children('.humidity').children('span').text(data.main.humidity);
}

// Get the current time in the city
function getTimeInCity(timezone) {
    const now = moment().utc().utcOffset(timezone / 60);
    return `, ${now.format('h:mm a')}`;
}

// Fill in the cards with weather data
function populateAllCards(data) {
    $('#city-name').text(data.city.name + getTimeInCity(data.city.timezone));
    populateCard('#card-day-0', data.list[0]);
    let card = 1;
    for(let i = 0; i < data.list.length; i++) {
        // Fill in each card with the weather at 12pm
        if(moment(data.list[i].dt_txt).format('h:mm a') === '12:00 pm') {
            populateCard(`#card-day-${card++}`, data.list[i]);
        }
    }
}

// Store weather data for city in local storage
function storeWeatherForCity(city, data) {
    if(!recentlySearched.includes(city)) {
        recentlySearched.unshift(city);
        saveRecents();
    }
    localStorage.setItem(city, JSON.stringify(data));
}

// Display recently searched cities on the side
function showRecents() {
    getRecents();
    const recents = $('#recent-searches');
    for(let i = 0; i < recentlySearched.length; i++) {
        const recent = recents.children('li').eq(i);
        recent.text(`${i + 1}. ${recentlySearched[i]}`);
        recent.show();
    }
    saveRecents();
}

// Get weather data for city from the api and put it on the page in cards
function getWeatherForCity(city) { 
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?units=metric&q=${city}&appid=${key}`
    fetch(apiUrl).then((response) => {
        return response.json();
    }).then((data) => {
        // If the city is not found, highlight the search bar in red to alert the user
        if(data.cod === '404') {
            $('#search-input').addClass('is-invalid');
            return;
        } else {
            // If the city is found, remove the red highlight (if it is there) and fill in the cards with the data
            $('#search-input').removeClass('is-invalid');
            populateAllCards(data);
            storeWeatherForCity(city, data);
            showRecents();
        }
    });
};

// Load stored data about a city
function loadWeatherForCity(city) {
    const data = JSON.parse(localStorage.getItem(city) || '[]');
    populateAllCards(data);
}

// When the search button is clicked, get the weather for the city in the input
function searchForWeather(event) {
    event.preventDefault();
    const city = $('#search-input').val();
    getWeatherForCity(city);
}

// When a recent city is clicked, load the weather data for that city
function recentClicked(event) {
    const city = $(event.target).text().split('. ')[1];
    loadWeatherForCity(city);
}

// When the page loads, setup the page
$(function(){ 
    // Hide recent searches and only show as many as we have saved
    $('#recent-searches').children('li').hide();
    showRecents();

    // Attach event listeners to the search button and recent searches
    $('#search-button').click(searchForWeather); 
    $('.list-group-item').click(recentClicked);
});