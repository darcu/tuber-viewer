function netRequest(url, params, options, callback) {
	var api = '//localhost:5454/';
	url = api + url;

	var xhr = new XMLHttpRequest();

	xhr.open(options.method || 'POST', url, true);
	// xhr.withCredentials = true;
	// xhr.send(JSON.stringify(params));


	var formData = new FormData();
	for (var k in params) {
		if (params.hasOwnProperty(k)) {
			formData.append(k, params[k]);
		}
	}

	xhr.send(formData);

	// cyn.Utils.objectForEach(params, function(_val, _var) {
	// 	if (_val instanceof Blob || _val instanceof File) {
	// 		formData.append(_var, _val, _var);
	// 	} else if (_val instanceof Array) {
	// 		_val.forEach(function(_arrayVal, _arrayVar) {
	// 			formData.append(_var + '[' + _arrayVar + ']', _arrayVal);
	// 		});
	// 	} else {
	// 		formData.append(_var, _val);
	// 	}
	// });

	xhr.addEventListener('load', function(e) {
		callback(null, JSON.parse(e.target.response));
	}, false);

	xhr.addEventListener('error', function(err) {
		callback(err);
	}, false);

	xhr.addEventListener('timeout', function(err) {
		callback(err);
	}, false);

	xhr.addEventListener('abort', function(err) {
		callback(err);
	}, false);
};

module.exports = netRequest;
