const express = require('express');
const router = express.Router();
const MusixMatch = require('../services/MusixMatch')
const APIKEY = process.env.APIKEY || ""
const m = new MusixMatch(APIKEY)

const APIError = require('../utils/APIError')

/* GET home page. */
router.get('/getTrack', async function(req, res, next) {
	const lyrics = req.query.lyrics
	if(!lyrics){
		next(new APIError(400, "Lyrics param is required"))
		return
	}
	try{
		let track = await m.fetchTrack(lyrics)
		res.json(track)
	}catch(err){
		console.error(err)
		next(new APIError(500, "Unable to fetch track"))
		return
	}
});

router.get('/getLyrics', async function(req, res, next) {
	const trackID = req.query.trackID
	if(!trackID){
		next(new APIError(400, "trackID param is required"))
		return 
	}
	try{
		let lyrics = await m.fetchLyrics(trackID)
		res.json(lyrics)
	}catch(err){
		console.error(err)
		next(new APIError(500, "Unable to fetch lyrics"))
		return
	}
	
});

router.get('/getRelatedTrack', async function(req, res, next) {
	const trackID = req.query.trackID
	if(!trackID){
		next(new APIError(400, "trackID param is required"))
		return 
	}
	try{
		let track = await m.getRelatedTrack(trackID)
		res.json(track)
	}catch(err){
		console.error(err)
		next(new APIError(500, "Unable to fetch related track"))
		return
	}
});

module.exports = router;
