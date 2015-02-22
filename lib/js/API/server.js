var NET = require('./net.js');

var server = {};
server.getList = function(list, callback) {
	NET('list/get', {}, {}, function(err, resp) {
		if (!err && resp.list) {
			callback && callback(null, resp.list);
		} else {
			callback && callback(err);
		}
	});
};

server.addID = function(id, callback) {
	NET('list/add', {
		'id': id
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
		'id': id
	}, {}, function(err, resp) {
		if (!err && resp.list) {
			callback && callback(null, resp.list);
		} else {
			callback && callback(err);
		}
	});
};

server.login = function(token) {
	NET('user/login', {
		'token': token
	}, {}, function(err, resp) {
		console.log('logged in on the server');
		if (!err) {
			// callback && callback(null, resp.list);
		} else {
			// callback && callback(err);.
		}
	});
};

module.exports = server;
