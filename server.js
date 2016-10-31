// Miroslav Georgiev
'use strict';

// load the packages
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const compress = require('compression');
const helmet = require('helmet');
const morgan = require('morgan');
const spdy = require('spdy');
const config = require('./server/config');
const helpers = require('./server/helpers');
const apiRoutesV1 = require('./server/routes/v1/api').apiRoutes(app, express);
const options = {
    key: fs.readFileSync('server/certs/appname.key'),
    cert: fs.readFileSync('server/certs/appname.pem'),
    passphrase: config.certphrase,
    secureOptions: crypto.constants.SSL_OP_NO_TLSv1
};

// add the CA for non development environments e.g. test, production, etc.
if (config.env !== 'development') {
    options.ca = [
        fs.readFileSync('server/certs/certificateca.cer')
    ]
}

// print if debugging logs are enabled
if (config.debug) {
    console.info(`##############################`);
    console.info(`###     DEBUG ENABLED     ####`);
    console.info(`##############################`);

    // log all requests to the console
    app.use(morgan('dev'));
}

// compress static files (JavaScript, CSS)
// MUST BE PLACED BEFORE DEFINING THE STATIC FILES FOLDER/PATH!!!
app.use(compress());

// protect the app from some well-known web vulnerabilities by setting HTTP headers appropriately
app.use(helmet());

// use body parser to grab information from POST requests
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// use body parser to get info from POST requests
// for parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
// for parsing application/json
app.use(bodyParser.json());

// handle CORS requests
app.use(helpers.handleCORS);

// set the public folder to serve public assets the frontend will request
app.use(express.static('public'));

// all the routes will be prefixed with /api
app.use('/api/v1', apiRoutesV1);

// error handling
app.use(helpers.handleErrors);

// catch all routes and send the user to the frontend
// has to be registered after API ROUTES
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/index.html'));
});

// start the server
spdy.createServer(options, app).listen(config.port, () => {
    console.info(`${new Date()}: The server has been started on port ${config.port}`);
    console.info(`${new Date()}: The environment is ${config.env}`);
});