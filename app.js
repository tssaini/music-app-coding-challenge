var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var morgan = require('morgan');
const APIError = require('./utils/APIError')
var indexRouter = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

// error handler
app.use(function(err, req, res, next) {
	if (err !== null) {
		if (err instanceof APIError) {
			res.status(err.statusCode).json({type: 'error', message: err.message})
		}
	}
});

app.use((req, res) => {
	const err = new APIError(404, 'Not Found');
	res.status(err.statusCode).json({ type: 'error', message: 'the url you are trying to reach is not hosted on our server' });
});

module.exports = app;
