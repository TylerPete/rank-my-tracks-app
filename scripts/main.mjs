//the entry point and initializer/connector of all modules


//Entry point that initializes and connects all modules.
//Sets up event listeners and overall app flow.

import { loadAccessToken, searchForResults } from "./spotify-api.mjs";
import Track from "./track.mjs";  //is this needed here??

const accessToken = await loadAccessToken();
console.log("Access token: ", accessToken);

// const newTrack = new Track("12345abc", "Guns for Hands", "21", "543349", "google.com");

// newTrack.incrementScore();

//testing the searchForResults function
searchForResults("Adele", accessToken, 5, "artist");