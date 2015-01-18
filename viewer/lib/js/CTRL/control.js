var player;
var s = require('./meta.js');
var LIST = s.list;

function pause() {
	player.pauseVideo();
}

function play() {
	player.playVideo();
}

function playVideo(id) {
	// require here to wait for the player script to load (maybe find a better way)
	player = require('../YT/ytplayer.js');

	player.loadVideoById(id);
	LIST.setCurrentID(id);
	stateChange();
}

var UI;
function stateChange(type) {
	// don't like this
	if (!UI) {
		UI = require('../UI/ui.js');
	}
	UI.update(type, LIST.getCurrentVideoIndex(), LIST.getPrevVideoIndex());
}

// exported
var ctrl = {};

ctrl.playPause = function() {
	if (ctrl.getState() === 'PLAYING') {
		pause();
	} else {
		play();
	}
};

ctrl.playIndex = function(i) {
	playVideo(LIST.getVideoIDatIndex(i));
};

ctrl.playID = function(id) {
	playVideo(id);
}

ctrl.playPrevVideo = function() {
	var prevVidID = LIST.getPrevVideoID();
	playVideo(prevVidID);
};

ctrl.playNextVideo = function() {
	var nextVidID = LIST.getNextVideoID();
	playVideo(nextVidID);
};

ctrl.event = function(type) {
	stateChange(type);
	(type === 'ENDED') && ctrl.playNextVideo();
};

ctrl.getState = function() {
	return player.getState();
};

module.exports = ctrl;
