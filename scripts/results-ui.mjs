//a Class + DOM function module

//Contains ResultsUI class to display final ranked list.
//Functions to generate DOM elements for ranked tracks and playback buttons.

export default class ResultsUI {
    constructor(tracksArray, parentElement) {
        this.tracksArray = tracksArray;
        this.parentElement = parentElement;
    }

    generateRankedList() {
        const instructions = document.querySelector("#instructionsMessage");
        instructions.textContent = "Your selected songs, ranked from favorite to least favorite!"

        this.parentElement.innerHTML = "";
        this.parentElement.classList.remove("songColumns");

        const songDivArray = this.tracksArray.map((track, index) => {
            const songDiv = document.createElement("div");
            songDiv.innerHTML = getSongResultTemplate(track, index);
            songDiv.classList.add("songResultDiv");
            return songDiv;
        });

        songDivArray.forEach(songDiv => {
            this.parentElement.appendChild(songDiv);
        });
    }
}

function getSongResultTemplate(song, index) {
    const imgUrl = song.albumImgUrl || "images/album-placeholder-64x64.svg";

    let songDivInnerHTML = `<img src="${song.albumImgUrl}" alt="${song.name} album's image" width="52" height="52">
                            <p class="name">${index + 1}. ${song.name}</p>`;

    return songDivInnerHTML;
}