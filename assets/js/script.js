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