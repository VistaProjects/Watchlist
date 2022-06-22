module.exports = (req, res, next) => {
	// Use the code from the request to retrieve an access token
	spotifyApi.authorizationCodeGrant(req.query.code).then(function (data) {
		console.log(`New access token: ${req.query.code}`);
		//console.log('The token expires in ' + data.body['expires_in']);
		// console.log('The access token is ' + data.body['access_token']);
		// console.log('The refresh token is ' + data.body['refresh_token']);
		res.cookie('auth', data.body['access_token'], {
			maxAge: data.body['expires_in'] * 1000 // one hour
		});
		req.success = true;
		next()
	},
	function (err) {
		req.success = false;
		next()
	}
)}