// Miroslav Georgiev
'use strict';

// BASE SETUP
// ======================================

// CALL THE PACKAGES --------------------
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var path = require('path');
var config = require('./config');
var apiRoutes = require('./app/routes/api')(app, express);

// use body parser to grab information from POST requests
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// handle CORS requests
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type, Authentication');
    next();
});

// log all requests to the console
app.use(morgan('dev'));

// set the public folder to serve public assets the frontend will request
app.use(express.static(__dirname + '/public'));

// all the routes will be prefixed with /api
app.use('/api', apiRoutes);

// catch all routes and send the user to the frontend
// has to be registered after API ROUTES
app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname + '/public/'));
});

// start the server
app.listen(config.port);
console.log('The server has been started on port ' + config.port);