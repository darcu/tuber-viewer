var UTIL = require('../UTIL/util.js');

var server = {};
server.getList = function(name, callback) {
	UTIL.netRequest('list/get', {
		'name': name || 'default'
	}, {}, function(err, response) {
		if (!err && response.vids) {
			callback(null, response.vids);
		} else {
			callback(err);
		}
	});
};

server.addID = function(id, list, callback) {
	// UTIL.netRequest('list/add', {
	// 	'name': name || 'default'
	// }, {}, function(err, response) {
	// 	if (!err && response.vids) {
	// 		callback(null, response.vids);
	// 	} else {
	// 		callback(err);
	// 	}
	// });
};

module.exports = server;
