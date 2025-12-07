//a Class module

//Contains the Tournament class: handles Swiss-style tournament logic.
//Methods: getNextMatchup(), recordWinner(track), isFinished(), getRankedTracks().
import { shuffleArray } from "./utils.mjs";
import { showMatchupAndWait } from "./matchup-ui.mjs";
import ResultsUI from "./results-ui.mjs";

export default class Tournament {
    constructor(tracksArray) {
        this.tracksArray = shuffleArray(tracksArray);
        this.numRounds = calculateNumSwissRounds(tracksArray);

        console.log(tracksArray);
    }

    getTracksArray() {
        return this.tracksArray;
    }

    async runTournament(parentElement) {
        let currentRoundNumber = 0;

        while (currentRoundNumber < this.numRounds) {
            currentRoundNumber++;

            console.log(`Starting Round ${currentRoundNumber}`);
            await runRound(this.tracksArray, currentRoundNumber, this.numRounds, parentElement);

            sortTracksByScore(this.tracksArray);
        }

        console.log("Final results: ", this.tracksArray);
        const results = new ResultsUI(this.tracksArray, parentElement);
        results.generateRankedList(parentElement)
    }
}

export function recordWinner(songId, tracksArray) {
    const winner = tracksArray.find(track => track.id === songId);

    winner.incrementScore();
}

export function recordOpponents(twoTracks, tracksArray) {
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
        const aSOS = a.opponents.reduce((acc, id) => acc + tracksArray.find(track => track.id === id).getScore(), 0);
        const bSOS = b.opponents.reduce((acc, id) => acc + tracksArray.find(track => track.id === id).getScore(), 0);
        return bSOS - aSOS;
    });
}

async function runRound(tracksArray, roundNumber, totalRounds, parentElement) {
    let currentIndex = 0;

    while (currentIndex < tracksArray.length) {
        const twoTracks = tracksArray.slice(currentIndex, currentIndex + 2);

        if (twoTracks.length > 1) {
            console.log(`1. ${twoTracks[0].name}`);
            console.log(`2. ${twoTracks[1].name}`);

            await showMatchupAndWait(twoTracks, tracksArray, roundNumber, totalRounds, parentElement);

        } else {
            recordWinner(twoTracks[0].id, tracksArray);
        }

        currentIndex += 2;
    }
}