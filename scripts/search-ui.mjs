//primarily a DOM function module

//Functions for displaying search results, artist cards, and album cards.
//Handles click events to trigger album or track selection.
import { getArtistAlbums } from "./spotify-api.mjs";
import { searchForArtists, getAlbumSongs } from "./spotify-api.mjs";
import { loadAccessToken, saveSearchState, loadSearchState } from "./storage.mjs";


export async function renderSearchResults(data, parentElement, type) {
    const accessToken = await loadAccessToken();

    if (type === "artist") {
        parentElement.classList.remove("songColumns");

        parentElement.innerHTML = "";

        data.forEach((element) => {
            const artistElement = document.createElement("div");
            artistElement.classList.add("artistDiv");
            artistElement.innerHTML = getArtistTemplate(element);

            parentElement.appendChild(artistElement);
            artistElement.setAttribute("data-id", element.id);

            artistElement.addEventListener("click", async (event) => {
                const clickedElement = event.currentTarget;

                console.log("Artist id: ", clickedElement.getAttribute("data-id"));
                const albumsData = await getArtistAlbums(clickedElement.getAttribute("data-id"), accessToken);

                renderSearchResults(albumsData, parentElement, "album");
            });
        });

    } else if (type === "album") {
        parentElement.classList.remove("songColumns");

        parentElement.innerHTML = "";

        console.log("Getting albums for this artist...");

        data.forEach((element) => {
            const albumElement = document.createElement("div");
            albumElement.classList.add("albumDiv");
            albumElement.innerHTML = getAlbumTemplate(element);

            parentElement.appendChild(albumElement);
            // albumElement.setAttribute("data-id", element.)
        });

        const albumIds = addGetSongsButton(parentElement);

    } else if (type === "song") {
        parentElement.classList.add("songColumns");

        parentElement.innerHTML = "";
        console.log("Logging song fetch results to console: ")

        const promises = data.map(albumId => getAlbumSongs(albumId, accessToken));
        const results = await Promise.all(promises);
        const songs = results.flat();

        console.log("Songs: ", songs);

        songs.forEach((element) => {
            const songElement = document.createElement("div");
            songElement.classList.add("songDiv");
            songElement.innerHTML = getSongTemplate(element);

            parentElement.appendChild(songElement);
        });


    }

    saveSearchState(data, type);
}
//template callback function for individual artist elements of an array returned by searchForArtists HERE

function getArtistTemplate(artist) {
    // <div class="artistDiv">
    //     <img src="images/adele-test-image.jpg" width="100" height="100">
    //     <p class="name">Adele</p>
    //     <button class="selectButton">Select this Artist</button>
    // </div>

    const imgUrl = artist.images?.[2]?.url ??
        artist.images?.[1]?.url ??
        artist.images?.[0]?.url ??
        "images/artist-placeholder-100x100.svg";

    let artistDivInnerHTML = `<img src=${imgUrl} alt="${artist.name} image" width="100" height="100">
                              <p class="name">${artist.name}</p>
                              <button class="selectButton">Select this Artist</button>`;

    return artistDivInnerHTML;
}

function getAlbumTemplate(album) {
    const imgUrl = album.images?.[2]?.url ??
        album.images?.[1]?.url ??
        album.images?.[0]?.url ??
        "images/album-placeholder-64x64.svg";

    let albumDivInnerHTML = `<img src=${album.images[2].url} alt="${album.name} image" width="64" height="64">
                             <p class="name">${album.name}</p>
                             <label for="${album.id}">Include?<input type="checkbox" class="albumCheckbox" id="${album.id}" name="${album.id}" data-id="${album.id}" value="yes" checked></label>`;

    return albumDivInnerHTML;
}

function getSongTemplate(song) {
    let songDivInnerHTML = `<img src=${song.albumImgUrl} alt="${song.name} album's image" width="52" height="52">
                            <p class="name">${song.name}</p>
                            <label for="${song.id}">Include?<input type="checkbox" class="songCheckbox" id="${song.id}" name="${song.id}" data-id="${song.id}" value="yes" checked></label>`;

    return songDivInnerHTML;
}

function addGetSongsButton(parentElement) {
    const getSongsButton = document.createElement("button");
    getSongsButton.classList.add("getSongsButton");
    getSongsButton.innerText = "Get Songs";
    parentElement.appendChild(getSongsButton);

    getSongsButton.addEventListener("click", async () => {
        const albumCheckboxesArray = Array.from(document.querySelectorAll(".albumCheckbox"));

        console.log("albumCheckboxesArray is an array: ", Array.isArray(albumCheckboxesArray));
        // console.log("albumCheckboxesArray: ", albumCheckboxesArray);

        const selectedAlbumCheckboxes = albumCheckboxesArray.filter(checkbox => checkbox.checked);
        // console.log("selectedAlbumCheckboxes: ", selectedAlbumCheckboxes);

        const selectedAlbumIds = selectedAlbumCheckboxes.map(checkbox => checkbox.dataset.id);
        console.log("Selected album ids: ", selectedAlbumIds);

        renderSearchResults(selectedAlbumIds, parentElement, "song");
    });
}