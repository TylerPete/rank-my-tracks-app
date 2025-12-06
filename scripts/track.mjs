//a Class module

//Contains the Track class: stores track data (id, title, artist, album, previewUrl, score) and methods like incrementScore().

export default class Track {
    constructor({ id, name, artistName, albumName, albumImgUrl, score = 0 }) {
        this.id = id;
        this.name = name;
        this.artistName = artistName;
        this.albumName = albumName;
        this.albumImgUrl = albumImgUrl;
        this.score = score;
        this.opponents = [];
    }

    incrementScore() {
        this.score++;

        console.log(`${this.name}'s new score: `, this.score);
    }

    getScore() {
        return this.score;
    }

    recordOpponent(opponentId) {
        this.opponents.push(opponentId);
    }

    getOpponents() {
        return this.opponents;
    }
}

export function createTracksFromSongsInfo(songsInfo) {
    const tracksArray = songsInfo.map((songInfo) => new Track({
        id: songInfo.id,
        name: songInfo.name,
        artistName: songInfo.artists[0].name,
        albumName: songInfo.album.name,
        albumImgUrl: songInfo.album.images?.[2]?.url ??
            songInfo.album.images?.[1]?.url ??
            songInfo.album.images?.[0]?.url ??
            "images/album-placeholder-64x64.svg",
        score: 0
    }));

    return tracksArray;
}