//the entry point and initializer/connector of all modules


//Entry point that initializes and connects all modules.
//Sets up event listeners and overall app flow.

import { searchForArtists } from "./spotify-api.mjs";
import { loadAccessToken } from "./storage.mjs";
import Track from "./track.mjs";  //is this needed here??
import { renderSearchResults } from "./search-ui.mjs";

const accessToken = await loadAccessToken();
console.log("Access token: ", accessToken);

// const newTrack = new Track("12345abc", "Guns for Hands", "21", "543349", "google.com");

// newTrack.incrementScore();

const searchBoxElement = document.querySelector("#searchBox");

console.log("searchBoxElement: ", searchBoxElement);

const searchButton = document.querySelector("#searchButton");

console.log("searchButton: ", searchButton);

searchButton.addEventListener("click", async (event) => {
    event.preventDefault();

    const query = searchBoxElement.value;

    console.log("search box value: ", query)

    const searchResults = await searchForArtists(query, accessToken, 8, undefined);

    const searchResultsDiv = document.querySelector("#searchResultsDiv");
    renderSearchResults(searchResults, searchResultsDiv, "artist");
});

//testing the searchForResults function
// console.log("Performing test search with hardcoded keyword: 'Adele'")
// const searchResults = await searchForArtists("Adele", accessToken, 5, undefined);
// console.log("Search results is data type array: ", Array.isArray(searchResults));