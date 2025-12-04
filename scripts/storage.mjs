//a function module

//Handles localStorage persistence.
//Functions: saveAccessToken(accessToken), loadAccessToken(), save/load tournament progress.

import { renderSearchResults } from "./search-ui.mjs";
import { getNewAccessToken } from "./spotify-api.mjs";

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

export function saveSearchState(data, type) {
    localStorage.setItem("rmtSearchData", JSON.stringify(data));
    localStorage.setItem("rmtType", type);
}

export function loadSearchState(parentElement) {
    const data = JSON.parse(localStorage.getItem("rmtSearchData"));
    const type = localStorage.getItem("rmtType");

    renderSearchResults(data, parentElement, type);

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