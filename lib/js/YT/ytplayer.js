var EV = require('../UTIL/events.js');
var ytAPI = require('iframe_api');

var YTSDKReady = false;
window.onYouTubeIframeAPIReady = function() {
	YTSDKReady = true;
	EV.trigger('YTIFRAMELOADED');
};

var PlayerState = {
	ENDED: 0,
	PLAYING: 1,
	PAUSED: 2,
	BUFFERING: 3,
	CUED: 5
};

function playerReady() {
	EV.trigger('YT_PLAYER_READY');
}

function playerStateChange(event) {
	switch (event.data) {
		case PlayerState.ENDED:
			EV.trigger('YT_PLAYER_STATE_CHANGE', 'ENDED');
			break;
		case PlayerState.PLAYING:
			EV.trigger('YT_PLAYER_STATE_CHANGE', 'PLAYING');
			break;
		case PlayerState.PAUSED:
			EV.trigger('YT_PLAYER_STATE_CHANGE', 'PAUSED');
			break;
	}
}

function calcPlayerWidth() {
	var playerElement = document.getElementById('playerWrapper');
	return playerElement.offsetWidth;
}

function calcPlayerHeight() {
	return parseInt(calcPlayerWidth() * 9 / 16) + 1;
}

var setPlayerSize = function() {
	if (ytplayer) {
		ytplayer.setSize(calcPlayerWidth(), calcPlayerHeight());
	}
}

EV.addListener('LOAD_UI', function() {
	setPlayerSize();
});

window.onresize = function() {
	setPlayerSize();
};

var ytplayer;
var createPlayer = function(vidID) {
	if (!YTSDKReady) {
		return;
	}

	ytplayer = new YT.Player('player', {
		videoId: vidID,
		playerVars: {
			autoplay: 0, // autoplay
			// controls: 0, // no controls
			// disablekb: 1, // no keyboard shortcuts
			fs: 1, // fullscreen
			iv_load_policy: 3, // no annotations by default
			loop: 1, // loop the video
			// mdoestbranding: 1, // no youtube logo
			rel: 1, // related videos at the end
			showinfo: 0 // no video info
		},
		events: {
			'onReady': playerReady,
			'onStateChange': playerStateChange
		}
	});

	ytplayer.getState = function() {
		if (ytplayer.getPlayerState) {
			switch (ytplayer.getPlayerState()) {
				case PlayerState.ENDED:
					return 'ENDED';
				case PlayerState.PLAYING:
					return 'PLAYING';
				case PlayerState.PAUSED:
					return 'PAUSED';
			}
		} else {
			return '';
		}
	};

	module.exports.player = ytplayer;
}

module.exports.createPlayer = createPlayer;
