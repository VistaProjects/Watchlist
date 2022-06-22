module.exports = (req, res, next) => {
	console.log(`${req.method} ${req._parsedUrl.pathname}`);
	next();
}