var c = {};

c.GAPI = {};
c.GAPI.clientId = '167294324522-9dv1gpeiq7pm5nnjh8f4kd30hvob2b2m.apps.googleusercontent.com';
c.GAPI.apiKey = 'AIzaSyDOFXUWoj--RHLYBfGCOBb3hv4l6Dzh1J0';
c.GAPI.scopes = 'https://www.googleapis.com/auth/plus.me https://www.googleapis.com/auth/youtube'; // https://www.googleapis.com/auth/plus.login
c.GAPI.LOADED = false;

c.USER = {};
c.USER.authenticated = false;
c.USER.id = 'default';

module.exports = c;

// window.ENV = c;