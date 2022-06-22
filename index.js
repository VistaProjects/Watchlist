require('dotenv').config();
const SpotifyWebApi = require('spotify-web-api-node');
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const connection = require('./db_config')

// Custom modules for spotify
const custom = require('./CustomSpotify');

console.clear()

// Settings api credientials creating global variable so we can use it everywher
spotifyApi = new SpotifyWebApi({
	clientId: process.env.CLIENT_ID,
	clientSecret: process.env.CLIENT_SECRET,
	redirectUri: process.env.REDIRECT_URI
});


var app = express();

// This will log every request to the console
app.use(require('./logging'));
app.use(cookieParser());
app.use(cors());
app.set('view engine', 'ejs');
app.use(express.json());

// https://blog.logrocket.com/how-to-use-ejs-template-node-js-application/
app.get("/", require("./authentication"), function(req, res) {
	// json object to pass to ejs
	var json = {}

	var auth = req.Authentication;
	var error = req.Error;

	// If the user is authenticated then send the data from user to the front end
	if (auth && !error) {
		// Ge users most listened tracks and generate a recommeneded list with albums
		spotifyApi.getMe().then(function (me) {
			try {
				json.spotify_user_id = me.body.id;
				json.spotify_name = me.body.display_name;
				json.spotify_image = me.body.images[0].url;
			} catch (error) {
				// Default settings
				json.spotify_name = 'username'
				json.spotify_image = 'https://i.scdn.co/image/ab6761610000e5eb15d8e761586590f74af0dd37'
			}
		}).then(() => {
			custom.recommend(50).then(function(result) {
				if (result.error){
					res.status(500).json(result.error)
					return
				}
				json.recommended = result

				res.render('index.ejs', {
					json: json,
				})
			})
		}, function (err) {
			console.log(err)
		})
		return
	}

	if (error){
		res.status(error.status).json({message: error.message})
		return
	}
	res.redirect(req.redirect);
});


app.get("/album/:album_id", require("./authentication"), function(req, res) {
	var _json = {}


	var auth = req.Authentication;
	var error = req.Error;
	
	// If the user is authenticated then send the data from user to the front end
	if (auth && !error) {
		spotifyApi.getMe().then(function (me) {
			try {
				_json.spotify_user_id = me.body.id;
				_json.spotify_name = me.body.display_name;
				_json.spotify_image = me.body.images[0].url;
			} catch (error) {
				// Default settings
				_json.spotify_name = 'username'
				_json.spotify_image = 'https://i.scdn.co/image/ab6761610000e5eb15d8e761586590f74af0dd37'
			}
		}).then(() => {		
			spotifyApi.getAlbum(req.params.album_id).then(function(data) {

				res.render('albums.ejs', {
					json: data.body,
					_json: _json
				})
			}, function(err) {
				res.status(500).json({error: err})
			});
		})
		return
	}
	if (error){
		res.status(error.status).json({message: error.message})
		return
	}
	res.redirect(req.redirect);
})

app.get("/review/:album_id", require("./authentication"), function(req, res) {
	var _json = {}


	var auth = req.Authentication;
	var error = req.Error;
	
	// If the user is authenticated then send the data from user to the front end
	if (auth && !error) {
		spotifyApi.getMe().then(function (me) {
			try {
				_json.spotify_user_id = me.body.id;
				_json.spotify_name = me.body.display_name;
				_json.spotify_image = me.body.images[0].url;
			} catch (error) {
				// Default settings
				_json.spotify_name = 'username'
				_json.spotify_image = 'https://i.scdn.co/image/ab6761610000e5eb15d8e761586590f74af0dd37'
			}
		}).then(() => {		
			spotifyApi.getAlbum(req.params.album_id).then(function(data) {
				// console.log(data.body)
				res.render('review_album.ejs', {
					album_name: data.body.name,
					image: data.body.images[0].url,
					album_id: data.body.id,
					json: data.body,
					_json: _json
				})
			}, function(err) {
				res.status(500).json({error: err})
			});
		})
		return
	}
	if (error){
		res.status(error.status).json({message: error.message})
		return
	}
	res.redirect(req.redirect);
})

app.post("/remove_watchlist", function(req, res) {
	connection.query("DELETE FROM tb_watchlist WHERE user_id = ? AND album_id = ?", [req.body.user_id, req.body.album_id], 
	function (err, rows, fields) {
		if (err) {
			res.status(500).json({message: err})
			return
		}
		res.status(200).json({success: true})
	});
	return
})


// App get /add_watchlist and receive json data with user_id and track_id
app.post("/add_watchlist", function(req, res) {
	console.log(req.body)
	connection.query("INSERT INTO tb_watchlist (user_id, album_id, watched, time_added) VALUES (?,?,?,?)", [req.body.user_id, req.body.album_id, false, new Date()], 
	function (err, rows, fields) {
		if (err) {
			res.status(500).json({message: err})
			return
		}
	 
		res.status(200).json({success: true})
		return
	});
})


app.post("/add_review", function(req, res) {
	console.log(req.body)

	connection.query("INSERT INTO tb_reviews (user_id, user_name, album_id, text, album_name, album_image) VALUES (?,?,?,?,?,?)", 
	[req.body.user_id, req.body.username, req.body.album_id, req.body.text, req.body.album_name, req.body.image], 
	function (err, rows, fields) {
		if (err) {
			res.status(500).json({message: err})
			return
		}
	 
		res.status(200).json({success: true})
		return
	});
})

app.get('/reviews', require("./authentication"), function (req, res) {
	var json = {}

	var auth = req.Authentication;
	var error = req.Error;
	
	// If the user is authenticated then send the data from user to the front end
	if (auth && !error) {
		spotifyApi.getMe().then(function (me) {
			try {
				json.spotify_user_id = me.body.id;
				json.spotify_name = me.body.display_name;
				json.spotify_image = me.body.images[0].url;
			} catch (error) {
				// Default settings
				json.spotify_name = 'username'
				json.spotify_image = 'https://i.scdn.co/image/ab6761610000e5eb15d8e761586590f74af0dd37'
			}
		}).then(() => {
			connection.query('SELECT * FROM `tb_reviews`', function (err, rows, fields) {
				if (err) { console.log(err); return }
				if (!rows.length) {
					res.send('No reviews found')
					return
				}
	
				res.render('reviews.ejs', {
					json: json,
					sql: rows,
				})
			});
		})
		return
	}
	if (error){
		res.status(error.status).json({message: error.message})
		return
	}
	res.redirect(req.redirect);

})
app.get('/watchlist', require("./authentication"), function (req, res) {
	var json = {}

	var auth = req.Authentication;
	var error = req.Error;
	// If the user is authenticated then send the data from user to the front end
	if (auth && !error) {
		spotifyApi.getMe().then(function (me) {
			try {
				json.spotify_user_id = me.body.id;
				json.spotify_name = me.body.display_name;
				json.spotify_image = me.body.images[0].url;
			} catch (error) {
				// Default settings
				json.spotify_name = 'username'
				json.spotify_image = 'https://i.scdn.co/image/ab6761610000e5eb15d8e761586590f74af0dd37'
			}
		}).then(() => {
			custom.watchlist().then(function(result) {
				json.result = result
				if (!result.sql.length){
					res.render('watchlist.ejs', {
						json: { albums: [] },
					})
					return
				}
	
				res.render('watchlist.ejs', {
					json: json,
				})
			})
		})
		return
	}

	if (error){
		res.status(error.status).json({message: error.message})
		return
	}
	res.redirect(req.redirect);
})

app.get('/callback', require("./callback"), function (req, res) {
	if (req.success){
		res.redirect('/');
	}
	else
	{
		res.status(500).json({
			error: 'Could not get access token'
		})
	}
})
app.listen(process.env.PORT, () => console.log(`Server is running on port ${process.env.PORT}`));