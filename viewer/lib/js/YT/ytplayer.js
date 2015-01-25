var youtube = require('youtube-iframe-player');

var CTRL = require('../CTRL/control.js');
var m = require('../CTRL/meta.js');
var LIST = m.list;

var PlayerState = {
	ENDED: 0,
	PLAYING: 1,
	PAUSED: 2,
	BUFFERING: 3,
	CUED: 5
};

// exported
var ytplayer;
youtube.init(function() {
	ytplayer = youtube.createPlayer('player', {
		height: calcPlayerHeight(),
		width: calcPlayerWidth(),
		videoId: LIST.getCurrentVideoID(),
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
			'onReady': playerReady,
			'onStateChange': playerStateChange
		}
	});

	module.exports = ytplayer;

	function playerReady() {
		CTRL.event('YT_PLAYER_READY');
	}

	function playerStateChange(event) {
		switch (event.data) {
			case PlayerState.ENDED:
				CTRL.event('ENDED');
				break;
			case PlayerState.PLAYING:
				CTRL.event('PLAYING');
				break;
			case PlayerState.PAUSED:
				CTRL.event('PAUSED');
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

	window.onresize = function() {
		ytplayer.setSize(calcPlayerWidth(), calcPlayerHeight());
	};

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
});
