//a function module

//Fetching data from Spotify API.
//Functions: getNewAccessToken(clientId, clientSecret), searchForResults(keywordString, type), getAlbumsByArtist(artistId), getTracksByAlbum(albumId).
import { CLIENT_ID, CLIENT_SECRET, ACCESS_TOKEN_URL, API_BASE_URL, getSpotifyGETOptions } from "./config.mjs";
import Track from "./track.mjs";    //is this needed here??
import { getArrayBatches, delay } from "./utils.mjs";

export async function getNewAccessToken() {
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

export async function searchForArtists(keywordString, accessToken, limit = 20, type = "artist") {
    let searchEndpointURL = buildSearchURL(keywordString, limit, type);

    const options = getSpotifyGETOptions(accessToken);

    try {
        const response = await fetch(searchEndpointURL, options);

        if (!response.ok) {
            throw new Error("Spotify API error");
        }

        const data = await response.json();

        console.log("Logging artist search results to console: ");
        console.log(data.artists.items);

        return data.artists.items;

    } catch (error) {
        console.error("Error fetching search results", error);

        return null;
    }
}

export async function getArtistAlbums(artistId, accessToken) {
    let albumsEndpointURL = buildAlbumsURL(artistId);
    console.log("Spotify API albums endpoint URL: ", albumsEndpointURL);

    const options = getSpotifyGETOptions(accessToken);

    try {
        const response = await fetch(albumsEndpointURL, options);

        if (!response.ok) {
            throw new Error("Spotify API error");
        }

        const data = await response.json();

        console.log("Logging album fetch results to console: ");
        console.log(data.items);

        return data.items;

    } catch (error) {
        console.error("Error fetching search results", error);

        return null;
    }
}

export async function getAlbumSongs(albumId, accessToken) {
    let songsEndpointURL = buildSongsURL(albumId);

    const options = getSpotifyGETOptions(accessToken);

    try {
        const response = await fetch(songsEndpointURL, options);

        if (!response.ok) {
            throw new Error("Spotify API error");
        }

        const data = await response.json();

        return data.items;

    } catch (error) {
        console.error("Error fetching search results", error);

        return null;
    }
}

export async function getOneAlbum(albumId, accessToken) {
    let oneAlbumEndpointURL = buildOneAlbumURL(albumId);

    const options = getSpotifyGETOptions(accessToken);

    try {
        const response = await fetch(oneAlbumEndpointURL, options);
        if (!response.ok) {
            throw new Error("Spotify API error");
        }

        const data = await response.json();

        return data;
    } catch (error) {
        console.error("Error fetching search results", error);

        return null;
    }
}

export async function getSongsInfo(songIdsArray, accessToken) {
    const batchedIdsArray = getArrayBatches(songIdsArray, 50);
    const options = getSpotifyGETOptions(accessToken);

    let allSongsInfo = [];

    let multiSongEndpointURLs = batchedIdsArray.map((batch) => buildMultiSongURL(batch));

    for (const url of multiSongEndpointURLs) {
        try {
            const response = await fetch(url, options);

            if (response.status === 429) {
                const retryAfter = parseInt(response.headers.get("Retry-After")) || 5;
                console.warn(`Rate limited by API. Retrying after ${retryAfter} seconds...`);

                await delay(retryAfter * 1000);
                continue;
            }

            if (!response.ok) {
                throw new Error("Spotify API error");
            }

            const data = await response.json();

            allSongsInfo = allSongsInfo.concat(data.tracks);

        } catch (error) {
            console.error("Error fetching search results", error);

            return null;
        }

        await delay(10);
    };

    return allSongsInfo;
}

function buildSearchURL(keywordString, limit, type) {
    return `${API_BASE_URL}search?q=${encodeURIComponent(keywordString)}&type=${type}&limit=${limit}`;
}

function buildAlbumsURL(artistId) {
    return `${API_BASE_URL}artists/${artistId}/albums?include_groups=album,single&limit=50`;
}

function buildOneAlbumURL(albumId) {
    return `${API_BASE_URL}albums/${albumId}`;
}

function buildSongsURL(albumId) {
    return `${API_BASE_URL}albums/${albumId}/tracks?limit=50`;
}

function buildMultiSongURL(songIdsArray) {
    const idsParam = songIdsArray.join(",");

    return `${API_BASE_URL}tracks?ids=${idsParam}`;
}
