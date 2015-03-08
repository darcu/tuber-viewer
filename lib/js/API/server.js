var NET = require('./net.js');
var ENV = require('../UTIL/env.js');

var server = {};
server.getList = function(callback) {
	NET('list/get', {
		'userId': ENV.USER.id,
	}, {}, function(err, resp) {
		if (!err && resp.list) {
			callback && callback(null, resp.list);
		} else {
			callback && callback(err);
		}
	});
};

server.addID = function(id, callback) {
	NET('list/add', {
		'id': id,
		'userId': ENV.USER.id,
	}, {}, function(err, resp) {
		if (!err && resp.list) {
			callback && callback(null, resp.list);
		} else {
			callback && callback(err);
		}
	});
};

server.removeID = function(id, callback) {
	NET('list/drop', {
		'id': id,
		'userId': ENV.USER.id
	}, {}, function(err, resp) {
		if (!err && resp.list) {
			callback && callback(null, resp.list);
		} else {
			callback && callback(err);
		}
	});
};

server.login = function() {
	NET('user/login', {
		'userId': ENV.USER.id
	}, {}, function() {});
};

module.exports = server;
