var ytapi = require('../YT/ytapi.js');
var getVideoMetadata = ytapi.getVideoMetadata;

var list = (function() {
	var l = {};

	var vids = [
		'Jcu1AHaTchM',
		'5OVvJOeUdUs',
		'Zh3VENebCgk'
	];

	var currID = vids[0];
	var prevID = null;

	l.getListLength = function() {
		return vids.length;
	};

	l.getAllVideoIDs = function() {
		return vids;
	};

	l.getVideoIDatIndex = function(i) {
		return vids[i];
	};

	l.getCurrentVideoID = function() {
		return currID;
	};

	l.getPrevVideoID = function() {
		return prevID;
	};

	l.getBackwardVideoID = function() {
		var ci = vids.indexOf(currID);
		var bID = null;

		if (ci !== -1) {
			if (ci - 1 >= 0) {
				bID = vids[ci - 1];
			} else if (vids.length !== 0) {
				bID = vids[vids.length - 1];
			}
		}

		return bID;
	};

	l.getForwardVideoID = function() {
		var ci = vids.indexOf(currID);
		var fID = null;

		if (ci !== -1) {
			if (ci + 1 < vids.length) {
				fID = vids[ci + 1];
			} else if (vids.length !== 0) {
				fID = vids[0];
			}
		}

		return fID;
	};

	l.setCurrentID = function(ID) {
		prevID = currID;
		currID = ID;
	};

	l.removeID = function(id) {
		var index = vids.indexOf(id);
		if (index !== -1) {
			vids.splice(index, 1);
		}
	};

	l.addID = function(id) {
		vids.push(id);
	};

	return l;
}());

var meta = {};
var vidMetadata = {};

meta.getCurrentVideoData = function() {
	return new Promise(function(resolve, reject) {
		meta.getVideoData(list.getCurrentVideoID()).then(resolve, reject);
	});
};

meta.getVideoData = function(id) {
	return new Promise(function(resolve, reject) {
		if (vidMetadata[id]) {
			resolve(vidMetadata[id]);
		} else {
			getVideoMetadata(id).then(function(data) {
				vidMetadata[id] = data;
				resolve(vidMetadata[id]);
			}, reject);
		}
	});
};

meta.searchFor = function(query) {
	return new Promise(function(resolve, reject) {
		ytapi.searchFor(query).then(function(items) {
			resolve(items);
		}, function(msg) {
			reject(msg);
		});
	});
};

module.exports.list = list;
module.exports.meta = meta;
