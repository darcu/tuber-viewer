/* global addClass, removeClass, meta, list, control */
/* exported select, unselect */

window.addEventListener('apiLoaded', function() {
	console.log('event');
	updateUI();
	drawList();
	// console.log('api loaded');.
});

var listItems = {};
var selectedSong = 0;

function select(i) {
	unselect(selectedSong);

	selectedSong = i;
	addClass(listItems[i], 'selectedSong');
}

function unselect(i) {
	removeClass(listItems[i], 'selectedSong');
}



// UI buttons and controls

var playPauseButton = document.getElementById('playpause');
playPauseButton.addEventListener('click', function() {
	control.playPause();
});

playPauseButton.setPause = function() {
	this.innerHTML = 'Pause';
};

playPauseButton.setPlay = function() {
	this.innerHTML = 'Play';
};



// var nextButton = document.getElementById('next');
// nextButton.addEventListener('click', function(e) {
// 	playNext();
// });

// var prevButton = document.getElementById('prev');
// prevButton.addEventListener('click', function(e) {
// 	playPrev();
// });

var songTitle = document.getElementById('title');

function setSongInfo(title, by) {
	songTitle.textContent = title + ' | ' + by;
}

function setTitle(title) {
	console.log('title');
	document.title = title + ' - Tuber';
}

// stuff that could happen independently of user actions in the native UI (i.e. not in the embedded YT player)
function updateUI() {
	updateCurrentSong();
	updatePlayPause();
}

function updateCurrentSong() {
	// console.log('ui info');

	meta.getCurrentVideoData().then(function(vidData) {
		setTitle(vidData.title);
		setSongInfo(vidData.title, vidData.channelTitle);
	});
}

function updatePlayPause() {
	switch (control.getState()) {
		case 'PLAYING':
			return 'PLAYING';
		case 'PAUSED':
			return 'PAUSED';
	}
}

var listElement = document.getElementById('list');


function drawListItem(i, title, by, duration) {
	console.log('draw ' + i + ' ' + title);

	var li = document.createElement('li');
	li.index = i;
	li.innerHTML = '<span class="listinfo duration">' + duration + '</span>' + ' ' +
		'<span class="listinfo title">' + title + '</span>' +
		'<span class="listinfo by">' + ' (by ' + by + ')' + '</span>';

	li.addEventListener('click', function() {
		select(i);
	});
	listItems[i] = li;

	if (listItems[i].length === 1) {
		listElement.appendChild(li);
	} else {
		var index = 1;
		while (!listItems[i + index] && index < list.getListLength()) {
			index++;
		}

		listElement.insertBefore(li, listItems[i + index]);
	}
}

function drawList() {
	var vids = list.getAllVideoIDs();

	vids.forEach(function(vidId, i) {
		meta.getVideoData(vidId).then(function(vidData) {
			drawListItem(i, vidData.title, vidData.channelTitle, vidData.duration);
		});
	});
}
