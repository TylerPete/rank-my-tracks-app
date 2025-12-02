//a Class module

//Contains the Track class: stores track data (id, title, artist, album, previewUrl, score) and methods like incrementScore().

export default class Track {
    constructor(trackId, title, artistId, albumId, previewUrl, score = 0) {
        this.trackId = trackId;
        this.title = title;
        this.artistId = artistId;
        this.albumId = albumId;
        this.previewUrl = previewUrl;
        this.score = score;
        this.initialized = false;
    }

    async init() {
        if (!this.initialized) {
            console.log("Performing asynchronous initialization aspects for the track");

            //asynchronous calls to the album and artist endpoints to get their respective names

            //this.artistName = 
            //this.albumName = 

            this.initialized = true;
        } else {
            console.log("Track already initialized");
        }
    }

    incrementScore() {
        this.score++;

        console.log("Track's new score: ", this.score);
    }
}