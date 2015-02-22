var UTIL = require('../UTIL/util.js');
var EV = require('../UTIL/events.js');

var loggedIn;

window.signinCallback = function(authResult) {
	if (authResult['status']['signed_in']) {
		// Update the app to reflect a signed in user
		// Hide the sign-in button now that the user is authorized, for example:
		document.getElementById('signinButton').setAttribute('style', 'display: none');
		console.log(authResult);

		loggedIn = true;

		EV.trigger('userSignIn', {
			loggedIn: loggedIn,
			token: authResult.access_token
		});
	} else {
		// Update the app to reflect a signed out user
		// Possible error values:
		//   "user_signed_out" - User is signed-out
		//   "access_denied" - User denied access to your app
		//   "immediate_failed" - Could not automatically log in the user
		document.getElementById('signinButton').setAttribute('style', 'display: inline');
		console.log('Sign-in state: ' + authResult['error']);

		loggedIn = false;

		EV.trigger('userSignIn', {
			loggedIn: loggedIn
		});
	}
};

// function checkSignIn() {
// 	return new Promise(function(resolve, reject) {
// 		if (UTIL.hasValue(loggedIn)) {
// 			resolve(loggedIn);
// 		} else {
// 			var counter = 0;
// 			var time = setTimeout(function() {
// 				if (counter > 10) {
// 					reject('not logged in');
// 					clearTimeout(time);
// 				} else if (UTIL.hasValue(loggedIn)) {
// 					resolve(loggedIn);
// 					clearTimeout(time);
// 				}
// 				counter++;
// 			}, 500);
// 		}
// 	});
// }

// module.exports.check = checkSignIn;
