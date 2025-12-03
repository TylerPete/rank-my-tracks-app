//primarily a DOM function module

//Functions for displaying search results, artist cards, and album cards.
//Handles click events to trigger album or track selection.

export function renderSearchResults(data, parentElement, type) {
    if (type === "artist") {
        data.forEach((element) => {
            const artistElement = document.createElement("div");
            artistElement.classList.add("artistDiv");

            artistElement.innerHTML = getArtistTemplate(element);

            parentElement.appendChild(artistElement);
        });

    } else if (type === "album") {

    } else if (type === "song") {

    }
}
//template callback function for individual artist elements of an array returned by searchForArtists HERE

function getArtistTemplate(artist) {
    // <div class="artistDiv">
    //     <img src="images/adele-test-image.jpg" width="100" height="100">
    //     <p class="name">Adele</p>
    //     <button class="selectButton">Select this Artist</button>
    // </div>

    let artistDivInnerHTML = `<img src=${artist.images[2].url} width="100" height="100">
                              <p class="name">${artist.name}</p>
                              <button class="selectButton">Select this Artist</button>`;

    return artistDivInnerHTML;
}