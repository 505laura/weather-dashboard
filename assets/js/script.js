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