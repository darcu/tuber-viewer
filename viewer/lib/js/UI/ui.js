var UTIL = require('../UTIL/util.js');
var CTRL = require('../CTRL/control.js');
var m = require('../CTRL/meta.js');
var META = m.meta;
var LIST = m.list;

// elements
var playPauseButton = document.getElementById('playpause');
var nextButton = document.getElementById('next');
var prevButton = document.getElementById('prev');
var repeatButton = document.getElementById('repeat');
var songTitle = document.getElementById('title');
var songDescription = document.getElementById('description');
var descriptionExpand = document.getElementById('descriptionExpand');
var addTab = document.getElementById('addtab');
var listTab = document.getElementById('listtab');
var listElement = document.getElementById('list');
var addWrapper = document.getElementById('addWrapper');
var searchList = document.getElementById('searchList');
var addSearch = document.getElementById('addSearch');
var songElements = {};

var listItems = [];
var searchItems = [];

// control interfaces
var uicontrol = {};
var selectedSong = null;
var descriptionExpanded = false;

uicontrol.setCurrent = function(id, pid) {
	if (songElements[pid] && UTIL.hasValue(id) && id !== pid) {
		UTIL.hasValue(pid) && UTIL.removeClass(songElements[pid], 'playing');
		UTIL.addClass(songElements[id], 'playing');
	}
};

uicontrol.select = function(id) {
	selectedSong && uicontrol.unselect(selectedSong);

	selectedSong = id;
	UTIL.addClass(songElements[id], 'selected');
};

uicontrol.unselect = function(id) {
	UTIL.removeClass(songElements[id], 'selected');
};

uicontrol.playID = function(id) {
	CTRL.playID(id);
};

uicontrol.playNext = function() {
	CTRL.playNextVideo();
};

uicontrol.playPrev = function() {
	CTRL.playPrevVideo();
};

uicontrol.playPause = function() {
	CTRL.playPause();
};

uicontrol.toggleRepeat = function() {
	CTRL.toggleRepeat();

	UTIL.addOrRemoveClass(repeatButton, 'light', CTRL.getRepeatState());
};

uicontrol.toggleExpandDescription = function() {
	descriptionExpanded = !descriptionExpanded;

	if (descriptionExpanded) {
		descriptionExpand.textContent = 'Show less ...';
	} else {
		descriptionExpand.textContent = 'Show more ...';
	}

	UTIL.addOrRemoveClass(songDescription, 'expanded', descriptionExpanded);
}

function createListItemContent(args) {
	return '<span class="listinfocontainer">' +
		(args.duration ? '<span class="listinfo duration">' + args.duration + ' </span>' : '') +
		'<span class="listinfo title">' + args.title + ' </span>' +
		'<span class="listinfo by">' + '(by ' + args.channel + ')' + '</span>' +
		'</span>';
}

var newListItem = function(args, buttons) {
	var li = document.createElement('li');

	li.vidID = args.id;
	li.className = 'listItem';
	li.innerHTML = createListItemContent(args);

	li.addEventListener('click', function() {
		uicontrol.select(args.id);
	});

	li.addEventListener('dblclick', function() {
		uicontrol.playID(args.id);
	});

	// touch control
	var ty;
	li.addEventListener('touchstart', function(e) {
		ty = e.changedTouches[0].pageY;
	});

	li.addEventListener('touchend', function(e) {
		// check whether tap or swipe
		if (Math.abs(e.changedTouches[0].pageY - ty) < 15) {
			uicontrol.select(args.id);
			uicontrol.playID(args.id);
		}
	});

	for (var i = 0, n = buttons.length; i < n; i++) {
		li.appendChild(buttons[i]);
	}

	return li;
};

var newButton = function(type, handler) {
	var but = document.createElement('button');
	UTIL.addClass(but, 'listButton button');
	switch (type) {
		case 'REMOVE':
			but.title = 'Remove video'; // hover tooltip
			but.innerHTML = '<i class="fa fa-times">';
			UTIL.addClass(but, 'removeButton');
			break;
		case 'ADD':
			but.title = 'Add video to the playlist';
			but.innerHTML = '<i class="fa fa-plus">';
			UTIL.addClass(but, 'addButton');
			break;
	}

	but.addEventListener('click', handler);
	return but;
};

var drawListItem = function(args) {
	var removeBut = newButton('REMOVE', function(e) {
		e.stopPropagation();

		LIST.removeID(args.id);

		delete songElements[args.id];
		listElement.removeChild(li);
	});

	var li = newListItem(args, [removeBut]);
	songElements[args.id] = li;

	if (args.bid) {
		var bindex = listItems.indexOf(args.bid);

		if (bindex !== -1) {
			listElement.insertBefore(li, songElements[listItems[bindex]]);
		}
	} else {
		// push
		listElement.appendChild(li);
	}
};

var drawSearchItem = function(args) {
	var addBut = newButton('ADD', function(e) {
		e.stopPropagation();

		LIST.addID(args.id);
		addToPlayList(args);
		searchList.removeChild(li);
	});

	var li = newListItem(args, [addBut]);
	songElements[args.id] = li;

	searchList.appendChild(li);
};

function addToPlayList(args) {
	listItems.push(args.id);
	drawListItem(args);
}

function addToSearchList(args) {
	searchItems.push(args.id);
	drawSearchItem(args);
}

var draw;
draw = (function() {
	var d = {};

	d.list = function() {
		var vids = LIST.getAllVideoIDs();

		vids.forEach(function(vidID) {
			META.getVideoData(vidID).then(function(vidData) {
				addToPlayList(vidData);
			}, UTIL.err);
		});
	};

	d.pause = function() {
		playPauseButton.title = 'Pause video';
		playPauseButton.innerHTML = '<i class="fa fa-pause">';
	};

	d.play = function() {
		playPauseButton.title = 'Play video';
		playPauseButton.innerHTML = '<i class="fa fa-play">';
	};

	d.setSongInfo = function(title, by) {
		songTitle.textContent = title + ' | ' + by;
	};

	d.setTitle = function(title) {
		document.title = '▶ ' + title + ' - Tuber';
	};

	d.description = function(description) {
		description = description.replace(/(?:\r\n|\r|\n)/g, '<br />');
		songDescription.innerHTML = description;
	};

	return d;
}());

var currentSong = function() {
	META.getCurrentVideoData().then(function(vidData) {
		draw.setTitle(vidData.title);
		draw.setSongInfo(vidData.title, vidData.channel);
		draw.description(vidData.description)
	}, UTIL.err);
};

var playState = function(type) {
	console.log('play state');
	console.log(type);

	switch (type) {
		case 'PLAYING':
			draw.pause();
			break;
		case 'PAUSED':
			draw.play();
			break;
	}
};

// external interfaces
var update = function(type, currID, prevID) {
	currentSong();
	playState(type);
	uicontrol.setCurrent(currID, prevID);
	(type === 'LIST') && draw.list();
};

module.exports.update = update;

// listeners
nextButton.addEventListener('click', function() {
	uicontrol.playNext();
});

prevButton.addEventListener('click', function() {
	uicontrol.playPrev();
});

playPauseButton.addEventListener('click', function() {
	uicontrol.playPause();
});

repeatButton.addEventListener('click', function() {
	uicontrol.toggleRepeat();
});

descriptionExpand.addEventListener('click', function() {
	uicontrol.toggleExpandDescription();
});

addTab.addEventListener('click', function() {
	UTIL.removeClass(listTab, 'selectedTab');
	UTIL.addClass(addTab, 'selectedTab');

	UTIL.removeClass(addWrapper, 'hidden');
	UTIL.addClass(listElement, 'hidden');
});

listTab.addEventListener('click', function() {
	UTIL.removeClass(addTab, 'selectedTab');
	UTIL.addClass(listTab, 'selectedTab');

	UTIL.removeClass(listElement, 'hidden');
	UTIL.addClass(addWrapper, 'hidden');
});

addSearch.addEventListener('keyup', function(e) {
	if (e.keyCode === 13) {
		META.searchFor(e.target.value).then(function(items) {
			clearSearchList();

			for (var i = 0, n = items.length; i < n; i++) {
				addToSearchList(items[i]);
			}
		}, UTIL.err);
	}
});


function clearSearchList() {
	searchItems = [];

	while (searchList.firstChild) {
		searchList.removeChild(searchList.firstChild);
	}

	// TODO check if the songs are cleared
}
