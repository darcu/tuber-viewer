'use strict';

var meta = require('./CTRL/meta.js');
var server = require('./CTRL/server.js');
var ytplayer = require('./YT/ytplayer.js');

function init() {
	server.getList('', function(err, list) {
		if (list && Array.isArray(list)) {
			list.forEach(function(id) {
				meta.list.addID(id);
			});
			ytplayer.createPlayer();
		}
	});
}

init();

