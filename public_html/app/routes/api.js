// Miroslav Georgiev
'use strict';

var jwt = require('jsonwebtoken');
var config = require('../../config');
var superSecret = config.secret;
var passport = require('passport');
var LdapStrategy = require('passport-ldapauth');

module.exports = function(app, express) {
    // get an instance of the express router
    var apiRouter = express.Router();

    passport.use('ldapauth', new LdapStrategy(config.ldap));
    apiRouter.use(passport.initialize());

    // route for authenticating users (POST http://localhost:8080/api/login)
    apiRouter.post('/login', authUser);

    function authUser(req, res, next) {
        passport.authenticate('ldapauth', { session: false, userNotFound: 'Sorry, but we could not find that username.' }, function(err, user, info) {
            var generateToken = function () {
                var token = jwt.sign({
                    name: user.name,
                    username: user.mailNickname
                }, superSecret, {
                    expiresInMinutes: 1440 // 24 hours
                });

                // return the information including a token as JSON
                return res.json({
                    success: true,
                    message: 'User ' + user.name + ' authenticated successfully!',
                    token: token
                });
            };

            if (err)
                return next(err);

            if (!user) {
                return res.json({
                    success: false,
                    message: 'Authentication failed! ' + info.message + '.'
                });
            }

            if (user) {
                // check if you need to verify group membership (memberof), otherwise, just generate the token
                if (!!config.ldapgroup) {
                    if (!!user.memberOf) {
                        for (var group of user.memberOf) {
                            if (config.ldapgroup === group)
                                return generateToken();
                        }
                    }

                    // if no group membership or no match was found, return no access message
                    return res.json({
                        success: false,
                        message: 'We are sorry, but it seems that user ' + user.name + ' doesn\'t have access to this application.'
                    });
                }

                return generateToken();
            }
        })(req, res, next);
    }

    // route middleware to verify a token
    apiRouter.use(function (req, res, next) {
        // do logging
        console.log('Somebody came to the app');

        // check header, url parameters or post parameters for token
        var token = req.body.token || req.params.token || req.headers['x-access-token'];

        // decode token
        if (token) {
            // verify secret and check expiration
            jwt.verify(token, superSecret, function (err, decoded) {
                if (err) {
                    return res.status(403).send({success: false, message: 'Failed to authenticate token!'});
                }
                else {
                    // if everything is good, save the request to be used by other routes
                    req.decoded = decoded;
                    next(); // allow the users to continue to the other routes
                }
            });
        }
        else {
            // if there is no token, return an HTTP response of 403 (forbidden) and an error message
            return res.status(403).send({success: false, message: 'No token provided.'});
        }
    });

    // test route to make sure everything is working (accessed at GET http://localhost:8080/api)
    apiRouter.get('/', function (req, res) {
        res.json({success: true, message: 'API is working'});
    });

    // more routes for our API go here

    // api endpoint to get user information
    apiRouter.get('/me', function (req, res) {
        res.send(req.decoded);
    });

    return apiRouter;
};
