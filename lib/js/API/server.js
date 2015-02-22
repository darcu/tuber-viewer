var NET = require('./net.js');
var USER = require('../MODEL/user.js');

var server = {};
server.getList = function(callback) {
	NET('list/get', {
		'userId': USER.id,
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
		'userId': USER.id,
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
		'userId': USER.id
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
		'userId': USER.id
	}, {}, function() {});
};

module.exports = server;
