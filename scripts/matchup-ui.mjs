//a Class + function module

//Contains MatchupModal class to show/hide matchup modal and update track info.
//Functions to handle user button clicks for choosing Track A or Track B.

import { recordWinner, recordOpponents } from "./tournament.mjs";

export default class MatchupModal {
    constructor(twoTracksArray, roundNumber, totalRounds) {
        this.track1 = twoTracksArray[0];
        this.track2 = twoTracksArray[1];
        this.roundNumber = roundNumber;
        this.totalRounds = totalRounds;
    }

    // showMatchup(tracksArray, parentElement) {
    //     displayMatchupModal(this.track1, this.track2, tracksArray, this.roundNumber, this.totalRounds, parentElement);
    // }
}

export function showMatchupAndWait(twoTracks, tracksArray, roundNumber, totalRounds, parentElement) {
    return new Promise((resolve) => {
        const matchupModal = document.createElement("dialog");
        matchupModal.setAttribute("id", "matchupModal");

        matchupModal.innerHTML = `<h3>Round ${roundNumber} of ${totalRounds}</h3>
        <h2>Which song do you prefer?</h2>
        <div class="twoSongDiv">
        ${getTrackFigureTemplate(twoTracks[0])}
        <h3 class="vsText">vs</h3>
        ${getTrackFigureTemplate(twoTracks[1])}
        </div>`;

        parentElement.parentElement.parentElement.appendChild(matchupModal);
        matchupModal.showModal();
        matchupModal.classList.add("open");

        const choiceButtons = matchupModal.querySelectorAll(".choiceButton");
        choiceButtons.forEach((button) => {
            button.addEventListener("click", (event) => {
                const winnerId = event.target.dataset.id;
                recordWinner(winnerId, tracksArray);

                recordOpponents(twoTracks, tracksArray);

                matchupModal.close();
                matchupModal.remove();

                resolve();
            });
        })
    });
}


function getTrackFigureTemplate(track) {
    return `<figure class="matchupTrack">
            <img src="${track.albumImgUrl}" alt="${track.name}'s album artwork" width="128" height="128">
            <figcaption class="trackName"><span>${track.name}</span>
            <br>${track.albumName}
            <br>${track.artistName}
            </figcaption>
            <button class="choiceButton" data-id="${track.id}">Choose ${track.name}</button>
            </figure>`;
}


// <dialog id="matchupModal">
//     <!--Testing matchup modal here-->
//     <h3>Round 3 of 7</h3>
//     <h2>Which song do you prefer?</h2>
//     <div class="twoSongDiv">
//         <figure class="matchupTrack">
//             <img src="images/album-placeholder-64x64.svg" alt="placeholder text" width="128" height="128">
//             <figcaption class="trackName"><span>Track A Title</span>
//                 <br>Album Name
//                 <br>Artist Name
//             </figcaption>
//             <button class="choiceButton" data-id="">Choose Track A</button>
//         </figure>
//         <h3 class="vsText">vs</h3>
//         <figure class="matchupTrack">
//             <img src="images/album-placeholder-64x64.svg" alt="placeholder text" width="128" height="128">
//             <figcaption class="trackName"><span>Track B Title</span>
//                 <br>Album Name
//                 <br>Artist Name
//             </figcaption>
//             <button class="choiceButton" data-id="">Choose Track B</button>
//         </figure>
//     </div>
// </dialog>