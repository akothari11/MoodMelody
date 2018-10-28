/**
 * This is an example of a basic node.js script that performs
 * the Implicit Grant oAuth2 flow to authenticate against
 * the Spotify Accounts.
 *
 * For more information, read
 * https://developer.spotify.com/web-api/authorization-guide/#implicit_grant_flow
 */

var express = require('express'); // Express web server framework
var app = express();
app.use(express.static(__dirname + '/public'));
console.log('Listening on 8888');
app.listen(8888);

var data = "";
var clientId = "925f67f4e9734987b21c8baedb00a817";
var responseType = "token";
var redirectURI = "http://localhost:8888";
var accessToken;