var meta = {};
var vidMetadata = {};

meta.getVideoData = function(id) {
	return new Promise(function(resolve, reject) {
		if (vidMetadata[id]) {
			resolve(vidMetadata[id]);
		} else {
			reject('no id');
		}
	});
};

meta.setVideoData = function(id, data) {
	vidMetadata[id] = data
};

module.exports = meta;
