var express = require('express');
var path = require("path");
var bodyParser = require('body-parser');
var morgan = require('morgan');
var _ = require("lodash");
var port = process.env.PORT || 9000;
var rootPath = path.normalize(__dirname + '/..');

var appPath;

var app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

appPath = path.join(rootPath, 'compiled')
if (app.get("env") === "development") {
	app.use(morgan('dev'));
	app.use(require('connect-livereload')());
};

if (app.get("env") === "production") {
	appPath = path.join(rootPath, 'dist');
}

app.use(express.static(appPath));

app.route('/*')
	.get(function (req, res) {
		res.sendFile(appPath + '/index.html');
	});

app.listen(port, function () {
	console.log('Listening on port ' + port + " in mode: " + app.get("env"));
});