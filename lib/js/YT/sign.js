var UTIL = require('../UTIL/util.js');
var EV = require('../UTIL/events.js');
var ENV = require('../UTIL/env.js');

var loggedIn;

EV.addListener('GAPILOADED', function() {
	console.log('check auth');
	checkAuth();
});

function checkAuth() {
	gapi.auth.authorize({
		client_id: ENV.GAPI.clientId,
		scope: ENV.GAPI.scopes,
		immediate: true
	}, handleAuthRes);
}

var signInClick = function() {
	gapi.auth.authorize({
		client_id: ENV.GAPI.clientId,
		scope: ENV.GAPI.scopes,
		immediate: false
	}, handleAuthRes);
};

var noUser = function() {
	EV.trigger('AUTHDONE');
};

var handleAuthRes = function(res) {
	var signinButton = document.getElementById('sign');
	var cont = document.getElementById('continue');

	var landing = document.getElementById('landing');
	var app = document.getElementById('app');

	if (res && !res.error) {
		UTIL.addClass(cont, 'hidden');
		UTIL.removeClass(app, 'hidden');


		console.log('loggedin');
		console.log(res);

		ENV.USER.authenticated = true;

		EV.trigger('AUTHDONE');
		EV.trigger('userSignIn', {
			token: res.access_token
		});
	} else {
		console.log('notloggedin');

		signinButton.onclick = signInClick;
		cont.onclick = noUser;
	}
}



// window.signinCallback = function(authResult) {
// 	if (authResult['status']['signed_in']) {
// 		// Update the app to reflect a signed in user
// 		// Hide the sign-in button now that the user is authorized, for example:
// 		document.getElementById('signinButton').setAttribute('style', 'display: none');
// 		console.log(authResult);

// 		loggedIn = true;

// 		EV.trigger('userSignIn', {
// 			loggedIn: loggedIn,
// 			token: authResult.access_token
// 		});
// 	} else {
// 		// Update the app to reflect a signed out user
// 		// Possible error values:
// 		//   "user_signed_out" - User is signed-out
// 		//   "access_denied" - User denied access to your app
// 		//   "immediate_failed" - Could not automatically log in the user
// 		document.getElementById('signinButton').setAttribute('style', 'display: inline');
// 		console.log('Sign-in state: ' + authResult['error']);

// 		loggedIn = false;

// 		EV.trigger('userSignIn', {
// 			loggedIn: loggedIn
// 		});
// 	}
// };
