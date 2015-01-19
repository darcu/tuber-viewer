var UTIL = require('../UTIL/util.js');
var CTRL = require('../CTRL/control.js');
var m = require('../CTRL/meta.js');
var META = m.meta;
var LIST = m.list;

// elements
var playPauseButton = document.getElementById('playpause');
var nextButton = document.getElementById('next');
var prevButton = document.getElementById('prev');
var songTitle = document.getElementById('title');
var addTab = document.getElementById('addtab');
var listTab = document.getElementById('listtab');
var listElement = document.getElementById('list');
var addWrapper = document.getElementById('addWrapper');
var searchList = document.getElementById('searchList');
var addSearch = document.getElementById('addSearch');
var listItems = {};
var searchItems = {};

// control interfaces
var control = {};
var selectedSong = null;

control.setCurrent = function(id, pid) {
	if (UTIL.hasValue(id) && id !== pid) {
		UTIL.hasValue(pid) && UTIL.removeClass(listItems[pid], 'playing');
		UTIL.addClass(listItems[id], 'playing');
	}
};

control.select = function(id) {
	selectedSong && control.unselect(selectedSong);

	selectedSong = id;
	UTIL.addClass(listItems[id], 'selected');
};

control.unselect = function(id) {
	UTIL.removeClass(listItems[id], 'selected');
};

control.playID = function(id) {
	CTRL.playID(id);
};

control.playNext = function() {
	CTRL.playNextVideo();
};

control.playPrev = function() {
	CTRL.playPrevVideo();
};

control.playPause = function() {
	CTRL.playPause();
};

var listItem = function(args, buttons) {
	var li = document.createElement('li');
	li.vidID = args.id;
	li.className = 'listItem';
	li.innerHTML =
		'<span class="listinfocontainer">' +
		(args.duration ? '<span class="listinfo duration">' + args.duration + ' </span>' : '') +
		'<span class="listinfo title">' + args.title + ' </span>' +
		'<span class="listinfo by">' + '(by ' + args.channel + ')' + '</span>' +
		'</span>';


	li.addEventListener('click', function() {
		control.select(args.id);
	});

	li.addEventListener('dblclick', function() {
		control.playID(args.id);
	});

	// touch control
	var ty;
	li.addEventListener('touchstart', function(e) {
		ty = e.changedTouches[0].pageY;
	});

	li.addEventListener('touchend', function(e) {
		// check whether tap or swipe
		if (Math.abs(e.changedTouches[0].pageY - ty) < 15) {
			control.select(args.id);
			control.playID(args.id);
		}
	});

	for (var i = 0, n = buttons.length; i < n; i++) {
		li.appendChild(buttons[i]);
	}

	return li;
};

var drawListItem = function(args) {
	var removeBut = document.createElement('button');
	removeBut.innerHTML = '<i class="fa fa-times">';
	removeBut.className = 'removeButton listButton button';
	removeBut.addEventListener('click', function() {
		LIST.removeID(args.id);
		listElement.removeChild(li);
	});

	var li = new listItem(args, [removeBut]);
	listItems[args.id] = li;

	if (args.bid) {
		listElement.insertBefore(li, listItems[args.bid]);
	} else {
		// push
		listElement.appendChild(li);
	}
};

var drawSearchItem = function(args) {
	var addBut = document.createElement('button');
	addBut.innerHTML = '<i class="fa fa-plus">';
	addBut.className = 'addButton listButton button';
	addBut.addEventListener('click', function() {
		LIST.addID(args.id);
		listItems.push(args);
		searchList.removeChild(li);
	});

	var li = new listItem(args, [addBut]);
	searchItems[args.id] = li;
	searchList.appendChild(li);
}

listItems.push = function(args) {
	drawListItem(args);
};

var draw;
draw = (function() {
	var d = {};

	d.list = function() {
		var vids = LIST.getAllVideoIDs();

		vids.forEach(function(vidID) {
			META.getVideoData(vidID).then(function(vidData) {
				listItems.push(vidData);
			});
		});
	};

	d.pause = function() {
		playPauseButton.innerHTML = 'Pause';
	};

	d.play = function() {
		playPauseButton.innerHTML = 'Play';
	};

	d.setSongInfo = function(title, by) {
		songTitle.textContent = title + ' | ' + by;
	};

	d.setTitle = function(title) {
		document.title = '▶ ' + title + ' - Tuber';
	};

	return d;
}());

var currentSong = function() {
	META.getCurrentVideoData().then(function(vidData) {
		draw.setTitle(vidData.title);
		draw.setSongInfo(vidData.title, vidData.channel);
	});
};

var playState = function(type) {
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
var update = function(type, currentIndex, previousIndex) {
	currentSong();
	playState(type);
	control.setCurrent(currentIndex, previousIndex);
	(type === 'LIST') && draw.list();
};

module.exports.update = update;

// listeners
nextButton.addEventListener('click', function() {
	control.playNext();
});

prevButton.addEventListener('click', function() {
	control.playPrev();
});

playPauseButton.addEventListener('click', function() {
	control.playPause();
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
			searchItems = {};

			while (searchList.firstChild) {
				searchList.removeChild(searchList.firstChild);
			}

			for (var i = 0, n = items.length; i < n; i++) {
				drawSearchItem(items[i]);
			}
		});
	}
});
