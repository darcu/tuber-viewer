/* global getVideoMetadata */
/* exported apiLoaded, meta, list */

var apiLoaded = new Event('apiLoaded');



var list = (function() {
	var l = {};

	var vids = [
		'Jcu1AHaTchM',
		'QRgPIbSX1mg',
		'5OVvJOeUdUs',
		'MHaKie-Jy2g',
		'lMUMwxvmBWE',
		'PZlKAa_GShc',
		'CvFH_6DNRCY',
	];

	var currIndex = 0;

	l.getListLength = function() {
		return vids.length;
	};

	l.getAllVideoIDs = function() {
		return vids;
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
			currIndex = vids.indexOf(ID);
		}
	};

	return l;
}());


var meta = (function() {
	var m = {};
	var vidMetadata = {};

	m.getCurrentVideoData = function() {
		return new Promise(function(resolve, reject) {
			m.getVideoData(list.getCurrentVideoID()).then(resolve, reject);
		});
	};

	m.getVideoData = function(id) {
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

	return m;
}());



// function addID(id) {
// 	getVidInfo(id).then(function() {
// 		vids.push(id);
// 		var vidData = vidMetadata[id];
// 		drawListItem(vids.length - 1, vidData.title, vidData.channelTitle, vidData.duration);
// 	}, function(err) {
// 		console.log(err);
// 	});
// }



// function updateVideoInfo() {
// 	getVidInfo(vids[currIndex]).then(updateUIInfo);
// }

// // add

// var addInput = document.getElementById('add');
// addInput.addEventListener('change', function(e) {
// 	var id = e.target.value;

// 	if (id.indexOf('?v='))


// 		addID(id);
// });
