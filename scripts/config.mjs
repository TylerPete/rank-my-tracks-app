//a single location to store important values such as Client ID, Client Secret, API base url, etc.

export const CLIENT_ID = "6005236ab5f64f629ba77a131afe8be2";
export const CLIENT_SECRET = "9584df284ff3424d95847f8e6f43241c";

export const API_BASE_URL = "https://api.spotify.com/v1/";
export const ACCESS_TOKEN_URL = "https://accounts.spotify.com/api/token";

export const SCOPES = "";

export function getSpotifyGETOptions(accessToken) {
    return {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${accessToken}`
        }
    };
}