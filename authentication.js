const connection = require('./db_config')

module.exports = (req, res, next) => {
	if (req.cookies['auth']) {
		var auth_cookie = req.cookies['auth'];

		// if token exists, set the access token on the API object, so we can make requests
		spotifyApi.setAccessToken(auth_cookie);

		// A check if the token is expired
		spotifyApi.getMe().then(function (data) {
			var user_id = data.body.id

			// We have valid spotify data so we can continue
			connection.query('SELECT * FROM `tb_users` WHERE user_id = ? ', [user_id], function (err, rows, fields) {
				if (err) { console.log(err); return }
				if (!rows.length){
					connection.query('INSERT INTO `tb_users` (`user_id`) VALUES (?)', [user_id], function (err, rows, fields) {
						if (!err) {
							console.log('Added new user to db')
						}
						else
						{
							console.log(err)
						}
					})
				}
			});
			req.getMe = data;
			req.Authentication = true;
			next();
		}, function (err) {
			res.clearCookie("auth")
			req.Authentication = false;
			req.Error = err.body.error
			next();	
		});
	}
	else
	{
		var scopes = [
			"ugc-image-upload",
			"user-read-playback-state",
			"user-modify-playback-state",
			"user-read-currently-playing",
			"user-read-private",
			"user-read-email",
			"user-follow-modify",
			"user-follow-read",
			"user-library-modify",
			"user-library-read",
			"streaming",
			"app-remote-control",
			"user-read-playback-position",
			"user-top-read",
			"user-read-recently-played",
			"playlist-modify-private",
			"playlist-read-collaborative",
			"playlist-read-private",
			"playlist-modify-public",
		];

		var state = 'Watchlist';
		req.redirect = spotifyApi.createAuthorizeURL(scopes, state);
		req.Authentication = false;	
		next();
	}
}