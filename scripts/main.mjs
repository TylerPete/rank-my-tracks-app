//the entry point and initializer/connector of all modules


//Entry point that initializes and connects all modules.
//Sets up event listeners and overall app flow.

import { searchForArtists } from "./spotify-api.mjs";
import { loadAccessToken, loadSearchState } from "./storage.mjs";
import Track from "./track.mjs";  //is this needed here??
import { renderSearchResults } from "./search-ui.mjs";

const accessToken = await loadAccessToken();
console.log("Access token: ", accessToken);

// const newTrack = new Track("12345abc", "Guns for Hands", "21", "543349", "google.com");

// newTrack.incrementScore();

const searchBoxElement = document.querySelector("#searchBox");

console.log("searchBoxElement: ", searchBoxElement);

const searchButton = document.querySelector("#searchButton");

const searchResultsDiv = document.querySelector("#searchResultsDiv");

searchButton.addEventListener("click", async (event) => {
    event.preventDefault();

    const query = searchBoxElement.value;

    console.log("search box value: ", query)

    const searchResults = await searchForArtists(query, accessToken, 8, undefined);

    renderSearchResults(searchResults, searchResultsDiv, "artist");
});

loadSearchState(searchResultsDiv);