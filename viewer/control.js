/* global player, list 	 */
/* exported control */

var control = (function() {
	var pause = function() {
		player.pauseVideo();
	};

	var play = function() {
		player.playVideo();
	};

	var playNextVideo = function() {
		var nextVidID = list.getNextVideoID();
		playVideo(nextVidID);
	}

	var playVideo = function(id) {
		player.loadVideoById(id);
		list.setCurrentID(id);
		stateChange();
	};

	function stateChange() {
		updateUI();
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

	ctrl.event = function(type) {
		switch (type) {
			case 'ENDED':
				playNextVideo();
				break;
			case 'PLAYING':
				// control.event('PLAYING');
				// playPauseButton.setPause();
				// updateVideoInfo();
				updateUI();
				break;
			case 'PAUSED':
				// control.event('PAUSED');
				// playPauseButton.setPlay();
				updateUI();
				break;
		}
	};

	ctrl.getState = function() {
		return player.getState();
	};

	return ctrl;
}());
