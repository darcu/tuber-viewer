/* global gapi, apiLoaded, YT, control, list */
/* exported handleClientLoad, onYouTubeIframeAPIReady, getVideoMetadata, player */



// G API init
// this handler is called once the GAPI script is loaded
function handleClientLoad() {
	var gApiKey = 'AIzaSyDgdx2bOcqHiwnRpBNEE_5y88MQUay0sNU';
	gapi.client.setApiKey(gApiKey);

	// this loads the YT data api and triggers an event once loaded
	(function loadYTDataAPI() {
		gapi.client.load('youtube', 'v3').then(function() {
			window.dispatchEvent(apiLoaded);
		});
	}());
}

// YT player init function > becomes YT player object
var player = function(vidID) {
	var play = new YT.Player('player', {
		height: calcPlayerHeight(),
		width: calcPlayerWidth(),
		videoId: vidID,
		playerVars: {
			autoplay: 0, // autoplay
			// controls: 0, // no controls
			// disablekb: 1, // no keyboard shortcuts
			fs: 0, // no fullscreen
			iv_load_policy: 3, // no annotations by default
			loop: 1, // loop the video
			// mdoestbranding: 1, // no youtube logo
			rel: 0, // related videos at the end
			showinfo: 0 // no video info
		},
		events: {
			'onReady': onPlayerReady,
			'onStateChange': onPlayerStateChange
		}
	});

	// // listeners
	function onPlayerReady() {
		// cueVids();

		// event.target.playVideo();
	}

	function onPlayerStateChange(event) {
		switch (event.data) {
			case YT.PlayerState.ENDED:
				control.event('ENDED');
				break;
			case YT.PlayerState.PLAYING:
				control.event('PLAYING');
				break;
			case YT.PlayerState.PAUSED:
				control.event('PAUSED');
				break;
		}
	}

	function calcPlayerWidth() {
		var playerElement = document.getElementById('playerWrapper');
		return playerElement.offsetWidth;
	}

	function calcPlayerHeight() {
		return calcPlayerWidth() * 9 / 16;
	}

	window.onresize = function() {
		play.setSize(calcPlayerWidth(), calcPlayerHeight());
	};

	play.getState = function() {
		if (play.getPlayerState) {
			switch (play.getPlayerState()) {
				case YT.PlayerState.ENDED:
					return 'ENDED';
				case YT.PlayerState.PLAYING:
					return 'PLAYING';
				case YT.PlayerState.PAUSED:
					return 'PAUSED';
			}
		} else {
			return '';
		}
	};

	// overwrite the init function
	player = play;
};

// YT iframe API init
// this loads the YT iframe api script async
(function() {
	var tag = document.createElement('script');

	tag.src = 'https://www.youtube.com/iframe_api';
	var firstScriptTag = document.getElementsByTagName('script')[0];
	firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}());

// handler for YT iframe API load event
function onYouTubeIframeAPIReady() {
	// create a new player and initialize it with the current video
	player(list.getCurrentVideoID());
}

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

var getVideoMetadata = function(id) {
	return new Promise(function(resolve, reject) {
		var req = gapi.client.youtube.videos.list({
			part: 'snippet,contentDetails', // to get the video metadata
			id: id
		});

		req.then(function(resp) {
			if (resp) {
				var data = {};
				data.title = resp.result.items[0].snippet.title;
				data.channelTitle = resp.result.items[0].snippet.channelTitle;
				data.duration = parseYTDuration(resp.result.items[0].contentDetails.duration);
				resolve(data);
			} else {
				reject('da fuck man!');
			}
		}, reject);
	});
};
