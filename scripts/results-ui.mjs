//a Class + DOM function module

//Contains ResultsUI class to display final ranked list.
//Functions to generate DOM elements for ranked tracks and playback buttons.
import { changeInstructionsMessage, delay } from "./utils.mjs";

export default class ResultsUI {
    constructor(tracksArray, parentElement) {
        this.tracksArray = tracksArray;
        this.parentElement = parentElement;
    }

    async generateRankedList() {
        changeInstructionsMessage("Your selected songs, ranked from favorite to least favorite!");

        this.parentElement.innerHTML = "";
        this.parentElement.classList.remove("songColumns");

        const songDivArray = this.tracksArray.map((track, index) => {
            const songDiv = document.createElement("div");
            songDiv.innerHTML = getSongResultTemplate(track, index);
            songDiv.classList.add("songResultDiv");
            return songDiv;
        });

        for (let i = songDivArray.length - 1; i >= 0; i--) {
            this.parentElement.prepend(songDivArray[i]);
            await delay(1);
            songDivArray[i].classList.add("added");
            await delay(250);
        }

        // songDivArray.forEach(songDiv => async function () {
        //     this.parentElement.appendChild(songDiv);
        //     await delay(100);
        // });
    }
}

function getSongResultTemplate(song, index) {
    const imgUrl = song.albumImgUrl || "images/album-placeholder-64x64.svg";

    let songDivInnerHTML = `<img src="${song.albumImgUrl}" alt="${song.name} album's image" width="52" height="52">
                            <p class="name">${index + 1}. ${song.name}</p>`;

    return songDivInnerHTML;
}