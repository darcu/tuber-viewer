var UTIL = require('../UTIL/util.js');
var EV = require('../UTIL/events.js');
var ENV = require('../UTIL/env.js');

var ytapi;
var gAPI;

require('google-client-api')().then(function(gapi) {
	console.log('gapi loaded');
	gAPI = gapi;
	gAPI.client.setApiKey = ENV.GAPI.apiKey;

	ENV.GAPI.LOADED = true;
	EV.trigger('GAPILOADED');
}, UTIL.err);


EV.addListener('AUTHDONE', function() {
	loadYouTubeAPI();
	if (ENV.USER.authenticated) {
		loadGPlusAPI();
	}
});

function loadYouTubeAPI() {
	gAPI.client.load('youtube', 'v3').then(function() {
		ytapi = gAPI.client.youtube;
		EV.trigger('YTAPILOADED');
	}, UTIL.err);
}

function loadGPlusAPI() {
	gAPI.client.load('plus', 'v1').then(function() {
		gAPI.client.plus.people.get({
			'userId': 'me'
		}).then(function(e) {
			// console.log('user data');
			// console.log(e.result);

			EV.trigger('userDataReady', {
				id: e.result.id
			});
		}, UTIL.err);
	}, UTIL.err);
}

// stolen from somewhere
function parseYTDuration(duration) {
	var regEx = new RegExp('([0-9])+');
	var time = '';
	var h = '';
	var m = '';
	var s = '';
	if (duration.indexOf('H') !== -1) {
		h = duration.substr(2, duration.indexOf('H'));
		h = regEx.exec(h)[0];
		(h.length === 1) && (h = '0' + h);
	}

	if (duration.indexOf('M') !== -1) {
		m = duration.substring(duration.indexOf('M') - 2, duration.indexOf('M'));
		m = regEx.exec(m)[0];
		(m.length === 1) && (m = '0' + m);
	}

	if (duration.indexOf('S') !== -1) {
		s = duration.substring(duration.indexOf('S') - 2, duration.indexOf('S'));
		s = regEx.exec(s)[0];
		(s.length === 1) && (s = '0' + s);
	}
	time = (h && (h + ':')) + (m && (m + ':')) + s;

	return time;
}

function getVideoMetadata(id) {
	return new Promise(function(resolve, reject) {
		if (!UTIL.hasValue(id)) {
			reject('no ID');
			return;
		}

		if (!ytapi) {
			reject('YouTube API not loaded');
			return;
		}

		var req = ytapi.videos.list({
			part: 'snippet,contentDetails,statistics', // to get the video metadata
			id: id
		});

		req.then(function(resp) {
			if (resp) {
				var data = {};
				data.id = id;
				data.title = resp.result.items[0].snippet.title;
				data.description = resp.result.items[0].snippet.description;
				data.channel = resp.result.items[0].snippet.channelTitle;
				data.duration = parseYTDuration(resp.result.items[0].contentDetails.duration);
				data.views = resp.result.items[0].statistics.viewCount;

				resolve(data);
			} else {
				reject('da fuck man!');
			}
		}, reject);
	});
}

function searchFor(query) {
	return new Promise(function(resolve, reject) {
		var req = ytapi.search.list({
			part: 'snippet',
			maxResults: 20,
			type: 'video',
			q: query
		});

		req.then(function(resp) {
			if (resp) {
				var data = [];
				for (var i = 0, n = resp.result.items.length; i < n; i++) {
					data.push({
						id: resp.result.items[i].id.videoId,
						title: resp.result.items[i].snippet.title,
						channel: resp.result.items[i].snippet.channelTitle,
						// duration: resp.result.items[i].contentDetails.duration
					});
				}

				resolve(data);
			} else {
				reject('da fuck man!');
			}
		}, reject);
	});
}

function signOut() {
	gAPI.auth.signOut();
}

module.exports.getVideoMetadata = getVideoMetadata;
module.exports.searchFor = searchFor;
module.exports.signOut = signOut;
