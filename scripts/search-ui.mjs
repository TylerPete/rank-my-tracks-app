//primarily a DOM function module

//Functions for displaying search results, artist cards, and album cards.
//Handles click events to trigger album or track selection.
import { getArtistAlbums } from "./spotify-api.mjs";
import { loadAccessToken, searchForArtists, getAlbumSongs } from "./spotify-api.mjs";


export async function renderSearchResults(data, parentElement, type) {
    const accessToken = await loadAccessToken();

    if (type === "artist") {
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
        parentElement.innerHTML = "";
        console.log("Logging song fetch results to console: ")

        const promises = data.map(albumId => getAlbumSongs(albumId, accessToken));
        const results = await Promise.all(promises);

        const songs = results.flat();

        console.log("Songs: ", songs);
    }
}
//template callback function for individual artist elements of an array returned by searchForArtists HERE

function getArtistTemplate(artist) {
    // <div class="artistDiv">
    //     <img src="images/adele-test-image.jpg" width="100" height="100">
    //     <p class="name">Adele</p>
    //     <button class="selectButton">Select this Artist</button>
    // </div>

    let artistDivInnerHTML = `<img src=${artist.images[2].url} alt="${artist.name} image" width="100" height="100">
                              <p class="name">${artist.name}</p>
                              <button class="selectButton">Select this Artist</button>`;

    return artistDivInnerHTML;
}

function getAlbumTemplate(album) {
    let albumDivInnerHTML = `<img src=${album.images[2].url} alt="${album.name} image" width="64" height="64">
                             <p class="name">${album.name}</p>
                             <label for="">Include?<input type="checkbox" class="albumCheckbox" id="${album.id}" name="${album.id}" data-id="${album.id}" value="yes" checked></label>`;

    return albumDivInnerHTML;
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