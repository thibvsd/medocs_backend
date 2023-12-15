require('dotenv').config();
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var drugsRouter = require('./routes/drugs');
var articlesRouter = require('./routes/articles');
var favoritesRouter = require('./routes/favorites');
var searchesRouter = require('./routes/searches');
var treatmentsRouter = require('./routes/treatments');

const cors = require('cors');

var app = express();
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/drugs', drugsRouter);
app.use('/favorites', favoritesRouter);
app.use('/articles', articlesRouter);
app.use('/searches', searchesRouter);
app.use('/treatments', treatmentsRouter);

module.exports = app;
