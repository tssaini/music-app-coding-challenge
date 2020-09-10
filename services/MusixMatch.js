const logger = require('../utils/logger');
const axios = require('axios');

const MUSIXMATCHURL = 'https://api.musixmatch.com/ws/1.1';

class MusixMatch {
	constructor(apiKey) {
		this.apiKey = apiKey
	}

	async fetchLyrics(trackID) {
		const params = {
			track_id: trackID,
			format: 'json',
			apikey: this.apiKey
		}
		const response = await axios.get(`${MUSIXMATCHURL}/track.lyrics.get`, {params});
		if(response.data.message.header.status_code != 200){
			throw new Error("Error fetching API")
		}
		return response.data.message.body
	}

	async fetchTrack(lyrics) {
		const params = {
			q_lyrics: lyrics,
			format: 'json',
			apikey: this.apiKey
		}
		const response = await axios.get(`${MUSIXMATCHURL}/track.search`, {params});
		if(response.data.message.header.status_code != 200){
			throw new Error("Error fetching API")
		}
		return response.data.message.body.track_list[0]
	}

	async getRelatedTrack(trackID){
		const lyrics = await this.fetchLyrics(trackID)
		let lyricsText = lyrics.lyrics.lyrics_body
		lyricsText = lyricsText.replace(/\n/g, " ")
		const lyricsWords = lyricsText.split(" ")
		
		const randomWords = []
		const numOfWords = lyricsWords.length > 5 ? 5: lyricsWords.length
		for(let i = 0; i < numOfWords; i++){
			let randInt = Math.floor(Math.random() * lyricsWords.length);
			randomWords.push(lyricsWords[randInt])
		}
		console.log(randomWords)
		return await this.fetchTrack(randomWords.join(" "))
	}

}

module.exports = MusixMatch