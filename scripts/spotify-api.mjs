//a function module

//Fetching data from Spotify API.
//Functions: getNewAccessToken(clientId, clientSecret), searchForResults(keywordString, type), getAlbumsByArtist(artistId), getTracksByAlbum(albumId).
import { CLIENT_ID, CLIENT_SECRET, ACCESS_TOKEN_URL, API_BASE_URL } from "./config.mjs";
import Track from "./track.mjs";    //is this needed here??

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

    const options = {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${accessToken}`
        }
    }

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

    const options = {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${accessToken}`
        }
    }

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
    let oneAlbumEndpointURL = buildOneAlbumURL(albumId);

    const options = {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${accessToken}`
        }
    }

    try {
        const albumResponse = await fetch(oneAlbumEndpointURL, options);

        const response = await fetch(songsEndpointURL, options);
        if (!response.ok || !albumResponse.ok) {
            throw new Error("Spotify API error");
        }

        const albumData = await albumResponse.json();

        const data = await response.json();

        data.items.forEach(track => {
            track.albumImgUrl = albumData?.images?.[2]?.url ??
                albumData.items.images?.[1]?.url ??
                albumData.items.images?.[0]?.url ??
                "images/album-placeholder-64x64.svg";
        });

        return data.items;

    } catch (error) {
        console.error("Error fetching search results", error);

        return null;
    }
}

function buildSearchURL(keywordString, limit, type) {
    return `${API_BASE_URL}search?q=${encodeURIComponent(keywordString)}&type=${type}&limit=${limit}`;
}

function buildAlbumsURL(artistId) {
    return `${API_BASE_URL}artists/${artistId}/albums?include_groups=album,single`;
}

function buildOneAlbumURL(albumId) {
    return `${API_BASE_URL}albums/${albumId}`;
}

function buildSongsURL(albumId) {
    return `${API_BASE_URL}albums/${albumId}/tracks?limit=50`;
}
