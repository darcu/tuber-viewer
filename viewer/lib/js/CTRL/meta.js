var ytapi = require('../YT/ytapi.js');
var getVideoMetadata = ytapi.getVideoMetadata;

var list = (function() {
	var l = {};

	var vids = [
		'e-ORhEE9VVg',
		'Jcu1AHaTchM',
		'QRgPIbSX1mg',
		'5OVvJOeUdUs',
		'MHaKie-Jy2g',
		'lMUMwxvmBWE',
		'PZlKAa_GShc',
		'CvFH_6DNRCY',
		'bw5pi9nUGJ8',
		'Sx1mHSo7ug4',
		'SE6bl_2xQ70',
		'cxtf0JcZgjg',
	];

	var currIndex = 0;
	var prevIndex = 0;

	l.getListLength = function() {
		return vids.length;
	};

	l.getAllVideoIDs = function() {
		return vids;
	};

	l.getVideoIDatIndex = function(i) {
		return vids[i];
	};

	l.getCurrentVideoIndex = function() {
		return currIndex;
	};

	l.getPrevVideoIndex = function() {
		return prevIndex;
	};

	l.getCurrentVideoID = function() {
		return vids[currIndex];
	};

	l.getNextVideoID = function() {
		if (currIndex + 1 >= vids.length) {
			return vids[0];
		} else {
			return vids[currIndex + 1];
		}
	};

	l.getPrevVideoID = function() {
		if (currIndex - 1 < 0) {
			return vids[vids.length - 1];
		} else {
			return vids[currIndex - 1];
		}
	};

	l.setCurrentID = function(ID) {
		if (vids.indexOf(ID) !== -1) {
			prevIndex = currIndex;
			currIndex = vids.indexOf(ID);
		}
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
