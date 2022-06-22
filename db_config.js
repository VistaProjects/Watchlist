const mysql = require("mysql");

const connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'vistasql123',
	database: 'watchlist'
})
connection.connect()


module.exports = connection