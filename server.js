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
const RateLimit = require('express-rate-limit');
const limiter = new RateLimit({
    windowMs: config.windowMs * 60 * 1000, // minutes windows to track requests (default 25)
    max: config.maxRequests, // limit each IP to maximum requests per windowMs (default 150)
    delayMs: 0 // disable delaying - full speed until the max limit is reached
});

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

// enable when you're behind a reverse proxy (Heroku, Bluemix, AWS if you use an ELB, custom Nginx setup, etc)
if (config.trustProxy) {
    app.enable('trust proxy');

    if (config.debug) {
        console.info(`${new Date()}: 'trust proxy' enabled!`);
    }
}

// compress static files (JavaScript, CSS)
// MUST BE PLACED BEFORE DEFINING THE STATIC FILES FOLDER/PATH!!!
app.use(compress());

// protect the app from some well-known web vulnerabilities by setting HTTP headers appropriately
app.use(helmet());

// apply rate limiter to all requests
app.use(limiter);

// use body parser to get info from POST requests
// for parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ limit: '2mb', extended: false }));
// for parsing application/json
app.use(bodyParser.json({ limit: '2mb' }));

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