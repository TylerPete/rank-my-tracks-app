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

    getTracksArray() {
        return this.tracksArray;
    }

    runTournament() {
        let currentRoundNumber = 0;

        while (currentRoundNumber < this.numRounds) {
            currentRoundNumber++;

            console.log(`Starting Round ${currentRoundNumber}`);
            runRound(this.tracksArray);

            sortTracksByScore(this.tracksArray);
        }

        console.log(this.tracksArray);
    }
}

function recordWinner(songId, tracksArray) {
    const winner = tracksArray.find(track => track.id === songId);

    winner.incrementScore();
}

function recordOpponents(twoTracks, tracksArray) {
    const track1 = tracksArray.find(track => track.id === twoTracks[0].id);
    const track2 = tracksArray.find(track => track.id === twoTracks[1].id);

    track1.recordOpponent(track2.id);
    track2.recordOpponent(track1.id);
}

function calculateNumSwissRounds(tracksArray) {
    return Math.ceil(Math.log2(tracksArray.length));
}

function sortTracksByScore(tracksArray) {
    tracksArray.sort((a, b) => {
        if (b.getScore() !== a.getScore()) {
            return b.getScore() - a.getScore()
        }

        //tie-breaker: "strength of schedule"
        const aSOS = a.getOpponents.reduce((acc, id) => acc + tracksArray.find(track => track.id === id).getScore());
        const bSOS = b.getOpponents.reduce((acc, id) => acc + tracksArray.find(track => track.id === id).getScore());
        return bSOS - aSOS;
    });
}

function runRound(tracksArray) {
    let currentIndex = 0;

    while (currentIndex < tracksArray.length) {
        const twoTracks = tracksArray.slice(currentIndex, currentIndex + 2);

        console.log(`1. ${twoTracks[0].name}`);
        console.log(`2. ${twoTracks[1].name}`);

        if (twoTracks.length > 1) {
            const selection = parseInt(prompt("Which song do you prefer?"));

            recordWinner(twoTracks[selection - 1].id, tracksArray);
            recordOpponents(twoTracks, tracksArray);
        } else if (twoTracks.length == 1) {
            recordWinner(twoTracks[0].id, tracksArray);
        }

        currentIndex += 2;
    }
}