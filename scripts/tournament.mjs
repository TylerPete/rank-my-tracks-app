//a Class module

//Contains the Tournament class: handles Swiss-style tournament logic.
//Methods: getNextMatchup(), recordWinner(track), isFinished(), getRankedTracks().
import { shuffleArray } from "./utils.mjs";

export default class Tournament {
    constructor(tracksArray) {
        this.tracksArray = shuffleArray(tracksArray);
        this.numRounds = calculateNumSwissRounds(tracksArray);

        console.log(tracksArray);
    }

    recordWinner(songId) {
        const winner = this.tracksArray.find(track => track.id === songId);

        winner.incrementScore();
    }

    getTracksArray() {
        return this.tracksArray;
    }
}

function calculateNumSwissRounds(tracksArray) {
    return Math.ceil(Math.log2(tracksArray.length));
}

function sortTracksByScore(tracksArray) {
    tracksArray.sort((a, b) => b.getScore() - a.getScore());
}

function runTournament(tracksArray, numRounds) {
    let currentRoundNumber = 1;

    while (currentRoundNumber <= this.numRounds) {
        runRound(tracksArray);

        sortTracksByScore(tracksArray);
    }
}

function runRound(tracksArray) {
    let currentIndex = 0;

    while (currentIndex < tracksArray.length) {
        const twoTracks = tracksArray.slice(currentIndex, currentIndex + 2);

        //trigger matchup for the twoTracks

        currentIndex += 2;
    }
}