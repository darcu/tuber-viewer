// var UI = require('../UI/ui.js');
var s = require('./meta.js');
var LIST = s.list;

var UI;
var player;
var repeat = false;

function pause() {
	player.pauseVideo();
}

function play() {
	player.playVideo();
}

function playVideo(id) {
	player.loadVideoById(id);
	LIST.setCurrentID(id);
	stateChange('PLAYING');
}

function stateChange(type) {
	// don't like this
	if (!UI) {
		UI = require('../UI/ui.js');
		UI.update(type, LIST.getCurrentVideoID(), LIST.getPrevVideoID());
	} else {
		UI.update(type, LIST.getCurrentVideoID(), LIST.getPrevVideoID());
	}
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
};

ctrl.playPrevVideo = function() {
	var prevVidID = LIST.getBackwardVideoID();
	playVideo(prevVidID);
};

ctrl.playNextVideo = function() {
	var nextVidID;
	if (!repeat) {
		nextVidID = LIST.getForwardVideoID();
	} else {
		nextVidID = LIST.getCurrentVideoID();
	}

	playVideo(nextVidID);
};

ctrl.toggleRepeat = function() {
	repeat = !repeat;
};

ctrl.getRepeatState = function() {
	return repeat;
};

ctrl.event = function(type) {
	switch (type) {
		case 'YT_PLAYER_READY':
			player = require('../YT/ytplayer.js')['player'];
			break;
		case 'ENDED':
			ctrl.playNextVideo();
			stateChange(type);
			break;
		case 'PAUSED':
			stateChange(type);
			break;
		case 'PAUSED':
			stateChange(type);
			break;
	}
};

ctrl.getState = function() {
	return player.getState();
};

module.exports = ctrl;
