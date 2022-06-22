const connection = require('./db_config')

let recommend = async function(limit) {
    var artists = []
	var tracks = []

	return new Promise(function (resolve, reject) {
		spotifyApi.getMyTopTracks({ limit: 5 }).then(function (data) {
			data.body.items.forEach(track => {
				tracks.push(track.id)

				track.artists.forEach(artist => {
					artists.push(artist.id)
				})
			});

			// Max length 5 - Up to 5 seed values may be provided in any combination of seed_artists, seed_tracks and seed_genres.
			artists.length = 2
			tracks.length = 3


			spotifyApi.getRecommendations({
				limit: limit,
				seed_tracks: tracks,
				seed_artists: artists
			}).then(function(data) {
				resolve(data.body.tracks)
			}, function(err) {
				reject({
					error: true,
					message: err
				})
			});
			return
		}, function (err) {
			console.log('Something went wrong!');
			reject(err)
		});
	})
};

let watchlist = async function(limit) {
	return new Promise(function (resolve, reject) {
		var albums = []
		var json = {}
		spotifyApi.getMe().then(function (data) {
			json.user_id = data.body.id;
			json.name = data.body.display_name;
			json.image = data.body.images[0].url;

			connection.query("SELECT * from tb_watchlist WHERE user_id LIKE ?", [data.body.id], function (err, rows, fields) {
				if (err) {
					reject(err)
					return
				}
				json.sql = rows


				rows.forEach(row => {
					albums.push(row.album_id)
				})
	
				if (!albums.length) {
					resolve(json)
					return
				}
	
	
				spotifyApi.getAlbums(albums).then(function(data) {
					json.albums = data.body.albums
					resolve(json)
				}, function(err) {
					req.Error = err
					resolve(err)
					return
				});
				return
			})
		}, function (err) {
			reject(err)
		});
	})
};

exports.recommend = recommend;
exports.watchlist = watchlist;