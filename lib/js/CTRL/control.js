var UTIL = require('../UTIL/util.js');
var EV = require('../UTIL/events.js');
var LIST = require('../MODEL/list.js');
var META = require('../MODEL/meta.js');
var API = require('../API/server.js');

var ytapi = require('../YT/ytapi.js');
var player; // require(ytapi)['player']
var repeat = false;

// exported
var ctrl = {};

function stateChange(type) {
	ctrl.update(type, LIST.getCurrentVideoID(), LIST.getPrevVideoID());
}

ctrl.init = function() {
	API.getList('', function(err, list) {
		if (list && Array.isArray(list)) {
			list.forEach(function(id) {
				LIST.addID(id);
			});
		}
	});
}

ctrl.playPause = function() {
	if (ctrl.getState() === 'PLAYING') {
		player.pauseVideo();
	} else {
		player.playVideo();

	}
};

ctrl.playIndex = function(i) {
	ctrl.playID(LIST.getVideoIDatIndex(i));
};

ctrl.playID = function(id) {
	if (id) {
		player.loadVideoById(id);
		LIST.setCurrentID(id);
		stateChange('PLAYING');
	}
};

ctrl.playPrevVideo = function() {
	var prevVidID = LIST.getBackwardVideoID();
	ctrl.playID(prevVidID);
};

ctrl.playNextVideo = function() {
	var nextVidID;
	if (!repeat) {
		nextVidID = LIST.getForwardVideoID();
	} else {
		nextVidID = LIST.getCurrentVideoID();
	}

	ctrl.playID(nextVidID);
};

ctrl.toggleRepeat = function() {
	repeat = !repeat;
};

ctrl.getRepeatState = function() {
	return repeat;
};

// TODO replace this with events
ctrl.event = function(type) {
	switch (type) {
		case 'ENDED':
			ctrl.playNextVideo();
			stateChange(type);
			break;
		case 'PAUSED':
			stateChange(type);
			break;
		case 'PLAYING':
			stateChange(type);
			break;
	}
};

ctrl.getState = function() {
	return player.getState();
};

// LIST
ctrl.getCurrentID = LIST.getCurrentVideoID;
ctrl.getAllVideoIDs = LIST.getAllVideoIDs;
ctrl.removeID = function(id) {
	LIST.removeID(id);
	API.removeID(id);
};

ctrl.addID = function(id) {
	LIST.addID(id);
	API.addID(id);
};

// LISTENERS

EV.addListener('ytAPILoaded', function() {
		ctrl.update('LIST');
});

var ytPlayer;
EV.addListener('YT_SDK_READY', function() {
	ytPlayer = require('../YT/ytplayer.js');
	ytPlayer.createPlayer(ctrl.getCurrentID());
});

EV.addListener('YT_PLAYER_READY', function() {
	player = ytPlayer.player;
});

EV.addListener('YT_PLAYER_STATE_CHANGE', function(type) {
	ctrl.event(type)
});

ctrl.update = function(type, currID, prevID) {
	EV.trigger('UIupdate', {
		type: type,
		currID: currID,
		prevID: prevID
	});
};

// META
ctrl.getVideoData = function(id) {
	return new Promise(function(resolve, reject) {
			META.getVideoData(id).then(resolve, function(err) {
				if (err === 'no id') {
					ytapi.getVideoMetadata(id).then(function(data) {
						META.setVideoData(id, data);
						resolve(data);
					}, reject);
				} else {
					reject(err);
				}
			});
	});
};

ctrl.getCurrentVideoData = function() {
	return new Promise(function(resolve, reject) {
		ctrl.getVideoData(LIST.getCurrentVideoID()).then(resolve, reject);
	});

};

ctrl.searchFor = function(query) {
	return new Promise(function(resolve, reject) {
		ytapi.searchFor(query).then(resolve, reject);
	});
};

module.exports = ctrl;
