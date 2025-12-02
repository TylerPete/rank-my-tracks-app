//a function module

//Fetching data from Spotify API.
//Functions: getNewAccessToken(clientId, clientSecret), searchForResults(keywordString, type), getAlbumsByArtist(artistId), getTracksByAlbum(albumId).
import { CLIENT_ID, CLIENT_SECRET, ACCESS_TOKEN_URL, API_BASE_URL } from "./config.mjs";

export async function loadAccessToken() {
    if (!isAccessTokenExpired()) {
        const accessToken = localStorage.getItem("spotifyApiAccessToken");

        console.log("Non-expired access token loaded");

        return accessToken;
    }
    else {
        console.log("Getting new access token... ");
        const accessToken = await getNewAccessToken();
        saveAccessToken(accessToken);

        return accessToken;
    }
}

async function getNewAccessToken() {
    const options = {
        method: "POST",
        body: "grant_type=client_credentials",
        grant_type: "client_credentials",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": "Basic " + btoa(CLIENT_ID + ":" + CLIENT_SECRET)
        }
    };

    try {
        const response = await fetch(ACCESS_TOKEN_URL, options);
        const data = await response.json();
        return data.access_token;
    } catch (error) {
        console.error("Error fetching access token: ", error);
        return null;
    }
}

function saveAccessToken(accessToken) {
    localStorage.setItem("spotifyApiAccessToken", accessToken);

    const now = Date.now();

    localStorage.setItem("spotifyTokenBirthTime", now);
}


function isAccessTokenExpired() {
    const tokenBirthTime = localStorage.getItem("spotifyTokenBirthTime");

    if (tokenBirthTime === null) {
        return true;
    } else {
        const now = Date.now();

        console.log("Access token age: ", (now - tokenBirthTime) / 60000, " minutes");

        return (now - tokenBirthTime) >= 3600000;
    }
}