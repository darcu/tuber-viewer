var UTIL = require('../UTIL/util.js');
var EV = require('../UTIL/events.js');
var ENV = require('../UTIL/env.js');

var ytapi;

var load = function() {
	var s = document.createElement('script');
	s.src = 'https://apis.google.com/js/client.js?onload=gapiLoad';
	document.body.appendChild(s);
}

module.exports.load = load;

var checkAuth = function(immediate) {
	gapi.auth.authorize({
		client_id: ENV.GAPI.clientId,
		scope: ENV.GAPI.scopes,
		immediate: immediate,
		cookiepolicy: 'single_host_origin'
	}, function(res) {
		if (res && !res.error) {
			loadGPlusAPI();
		}

		loadYouTubeAPI();
		EV.trigger('AUTHDONE');
	});
}

module.exports.signIn = checkAuth

window.gapiLoad = function() {
	gapi.client.setApiKey(ENV.GAPI.apiKey);

	ENV.GAPI.LOADED = true;
	checkAuth(true);
}

var loadYouTubeAPI = function() {
	gapi.client.load('youtube', 'v3').then(function() {
		ytapi = gapi.client.youtube;

		if (!ENV.USER.authenticated) {
			EV.trigger('LOAD_APP');
		}
	}, UTIL.err);
}

var loadGPlusAPI = function() {
	ENV.USER.authenticated = true;
	// maybe get user token here


	gapi.client.load('plus', 'v1').then(function() {
		gapi.client.plus.people.get({
			'userId': 'me'
		}).then(function(e) {
			ENV.USER.id = e.result.id;
			EV.trigger('LOAD_APP');
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

		ytapi.videos.list({
			part: 'snippet,contentDetails,statistics', // to get the video metadata
			id: id
		}).then(function(resp) {
			if (resp) {
				resolve(parseYouTubeResponse(resp.result.items[0]));
			} else {
				reject('da fuck man!');
			}
		}, reject);
	});
}

function searchFor(query) {
	return new Promise(function(resolve, reject) {
		ytapi.search.list({
			part: 'snippet',
			maxResults: 40,
			type: 'video',
			q: query
		}).then(function(resp) {
			if (resp) {
				var data = [];
				for (var i = 0, n = resp.result.items.length; i < n; i++) {
					data.push(parseYouTubeResponse(resp.result.items[i]));
				}

				resolve(data);
			} else {
				reject('da fuck man!');
			}
		}, reject);
	});
}

function parseYouTubeResponse(item) {
	return {
		id: item.id && item.id.videoId || item.id,
		title: item.snippet.title,
		channel: item.snippet.channelTitle,
		description: item.snippet.description,
		thumbUrl: item.snippet.thumbnails.medium.url,
		duration: item.contentDetails && parseYTDuration(item.contentDetails.duration),
		views: item.statistics && item.statistics.viewCount
	};
}

var signOut = function() {
	gapi.auth.signOut();
}

module.exports.getVideoMetadata = getVideoMetadata;
module.exports.searchFor = searchFor;
module.exports.signOut = signOut;
