//the entry point and initializer/connector of all modules


//Entry point that initializes and connects all modules.
//Sets up event listeners and overall app flow.

import { loadAccessToken, searchForArtists } from "./spotify-api.mjs";
import Track from "./track.mjs";  //is this needed here??
import { renderSearchResults } from "./search-ui.mjs";

const accessToken = await loadAccessToken();
console.log("Access token: ", accessToken);

// const newTrack = new Track("12345abc", "Guns for Hands", "21", "543349", "google.com");

// newTrack.incrementScore();

//testing the searchForResults function
console.log("Performing test search with hardcoded keyword: 'Adele'")
const searchResults = await searchForArtists("Adele", accessToken, 5, undefined);
console.log("Search results is data type array: ", Array.isArray(searchResults));

const searchResultsDiv = document.querySelector("#searchResultsDiv");

renderSearchResults(searchResults, searchResultsDiv, "artist");