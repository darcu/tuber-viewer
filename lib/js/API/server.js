var NET = require('../UTIL/net.js');

var server = {};
server.getList = function(list, callback) {
	NET('list/get', {
		'name': list || 'default'
	}, {}, function(err, response) {
		if (!err && response.vids) {
			callback(null, response.vids);
		} else {
			callback(err);
		}
	});
};

server.addID = function(id, list, callback) {
	NET('list/add', {
		'name': list || 'default',
		'id': id
	}, {}, function(err, response) {
		// if (!err && response.vids) {
		// 	callback(null, response.vids);
		// } else {
		// 	callback(err);
		// }
	});
};

module.exports = server;
