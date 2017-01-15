// Miroslav Georgiev
'use strict';

const jwt = require('jsonwebtoken');
const config = require('../../config');
const passport = require('passport');
const LdapStrategy = require('passport-ldapauth');
const superSecret = config.secret;

function apiRoutes(app, express) {
    // get an instance of the express router
    const apiRouter = express.Router();

    // define the authentication strategy and pass the settings
    passport.use('ldapauth', new LdapStrategy(config.ldaps));

    // initialize the strategy
    apiRouter.use(passport.initialize());

    /**
     * *************************************************
     * START ROUTES DEFINITIONS
     * *************************************************
     */

    /**
     * UNPROTECTED ROUTES
     */
    // api endpoint for testing
    apiRouter.get('/', (req, res) => {
        res.json({ success: true, message: 'API is working!' });
    });

    // route for authenticating users (POST /api/v1/authenticate)
    apiRouter.post('/authenticate', authUser);

    /**
     * route middleware to verify a token
     *
     * NOTE: it needs to be after all unprotected and before all protected routes
     * any route before it will NOT be protected by the middleware, so anybody CAN access it
     * any route after it will be protected by the middleware
     */
    apiRouter.use(validateToken);

    /**
     * PROTECTED ROUTES
     */
    // api endpoint for testing protected api endpoints
    apiRouter.get('/protected', (req, res) => {
        res.json({ success: true, message: 'protected API is working!' });
    });

    // api endpoint to get user information
    apiRouter.get('/me', (req, res) => res.send(req.decoded));

    /**
     * *************************************************
     * END ROUTES DEFINITIONS
     * *************************************************
     */

    /**
     * *************************************************
     */
    /**
     * @description Method to generate and sign a token
     * @param {Object} res
     * @param {Object} user - Object containing some information about the user e.g. name, username, etc.
     * @returns {Object}
     */
    function generateToken (res, user) {
        const token = jwt.sign({
            name: user.name,
            username: user.mailNickname
        }, superSecret, {
            expiresIn: '24h'
        });

        // return the information including a token as JSON
        return res.json({
            success: true,
            message: 'User ' + user.name + ' authenticated successfully!',
            token: token
        });
    }

    /**
     * @description Handler to validate a token or block users from accessing protected routes
     * @param req
     * @param res
     * @param next
     * @returns {*}
     */
    function validateToken (req, res, next) {
        // check header, url parameters or post parameters for token
        const token = req.body.token || req.params.token || req.headers['x-access-token'];

        // decode token
        if (token) {
            // verify secret and check expiration
            jwt.verify(token, superSecret, function (err, decoded) {
                if (err) {
                    return res.status(403).send({ success: false, message: 'Failed to authenticate token!' });
                } else {
                    // if everything is good, save the request to be used by other routes
                    req.decoded = decoded;

                    // allow the users to continue to the protected routes
                    next();
                }
            });
        } else {
            // if there is no token, return an HTTP response of 403 (forbidden) and an error message
            return res.status(403).send({ success: false, message: 'No token provided.' });
        }
    }

    /**
     * *************************************************
     * START ROUTES HANDLERS/METHODS
     * *************************************************
     */

    /**
     * @swagger
     * definitions:
     *   FailedToken:
     *     properties:
     *       success:
     *         type: boolean
     *         example: false
     *       message:
     *         type: string
     *         example: 'Token not valid or not provided!'
     *
     *   ServerError:
     *     properties:
     *       success:
     *         type: boolean
     *         example: false
     *       message:
     *         type: string
     *         example: 'Server or database error!'
     */

    /**
     * @swagger
     * definitions:
     *   Authenticate:
     *     required:
     *       - username
     *       - password
     *     properties:
     *       success:
     *         type: boolean
     *         default: true
     *       message:
     *         type: string
     *         example: 'Successfully authenticated!'
     *       token:
     *         type: string
     *         example: 'token.in.jwt.format'
     *
     *   FailedAuthenticate:
     *     required:
     *       - username
     *       - password
     *     properties:
     *       success:
     *         type: boolean
     *         default: false
     *       message:
     *         type: string
     *         example: 'Wrong credentials!'
     *
     *   NotInLDAPGroup:
     *     required:
     *       - username
     *       - password
     *     properties:
     *       success:
     *         type: boolean
     *         default: false
     *       message:
     *         type: string
     *         example: 'User is not part of the LDAP group'
     */

    /**
     * @swagger
     * /v1/authenticate:
     *   post:
     *     summary: Verify user and get a token
     *     description: Login to the application and generate a token
     *     tags: [Authenticate]
     *     produces:
     *       - application/json
     *     consumes:
     *       - application/x-www-form-urlencoded
     *     parameters:
     *       - name: username
     *         description: Username in the format `some.format`.
     *         in: formData
     *         required: true
     *         type: string
     *       - name: password
     *         description: User's password.
     *         in: formData
     *         required: true
     *         type: string
     *     responses:
     *       200:
     *         description: successful verification of credentials and returns a token
     *         schema:
     *           type: object
     *           $ref: '#/definitions/Authenticate'
     *       401:
     *         description: could not verify credentials
     *         schema:
     *           type: object
     *           $ref: '#/definitions/FailedAuthenticate'
     *       403:
     *         description: The user authenticated successfully, but is not part of the LDAP group to access the application
     *         schema:
     *           type: object
     *           $ref: '#/definitions/NotInLDAPGroup'
     *       500:
     *         description: failed to connect to LDAP or another server error
     *         schema:
     *           type: object
     *           $ref: '#/definitions/ServerError'
     */

    /**
     * @method authUser
     * @description Handler for /api/v1/authenticate POST requests. Authenticating users and generating access tokens.
     * @param req
     * @param res
     * @param next
     */
    function authUser(req, res, next) {
        if (config.debug) {
            console.info(`${new Date()}: Trying to authenticate '${req.body.username}'...`);
        }

        passport.authenticate('ldapauth', { session: false, userNotFound: 'Sorry, but we could not find that username.' }, (err, user, info) => {
            if (err) {
                // write to the error log file
                console.error(`${new Date()}: An error occurred during login for user '${req.body.username}':`, err);

                return next({ message: `Something went wrong and we couldn't perform authentication.` });
            }

            if (!user) {
                // write to the error log file
                console.error(`${new Date()}: Could not login user '${req.body.username}' and info msg:`, info);

                if (!info.message) {
                    info.message = 'Wrong username/password combination';
                }

                return next({ message: 'Authentication failed! ' + info.message + '.', code: 401 });
            }

            if (config.debug) {
                console.info(`${new Date()}: Successfully authenticated user '${req.body.username}'.`);
            }

            // check if you need to verify group membership (memberof), otherwise just generate the token
            if (config.ldapgroup) {
                if (config.debug) {
                    console.info(`${new Date()}: Verifying user '${req.body.username}' AD group membership for group '${config.ldapgroup}'...`);
                }

                if (!!user.memberOf) {
                    for (const group of user.memberOf) {
                        if (config.ldapgroup === group) {
                            if (config.debug) {
                                console.info(`${new Date()}: Successfully verified user '${req.body.username}' AD group membership for group '${config.ldapgroup}'.`);
                            }

                            return generateToken(res, user);
                        }
                    }
                }

                // write to the error log file
                console.error(`${new Date()}: Could not login user '${user.mailNickname}' (${user.name}), because not a member of '${config.ldapgroup}'`);

                // if no group membership or no match was found, return no access message
                return next({ message: 'We are sorry, but it seems that user ' + user.name + ' doesn\'t have access to this application.', code: 403 });
            }

            if (config.debug) {
                console.info(`${new Date()}: No AD group membership required, so skipping group membership verification for user '${req.body.username}' and generating a token...`);
            }

            return generateToken(res, user);
        })(req, res, next);
    }

    /**
     * *************************************************
     * END ROUTES HANDLERS/METHODS
     * *************************************************
     */

    /**
     * Describe the test api endpoints so swagger can generate documentation for them
     */

    /**
     * @swagger
     * /v1/:
     *   get:
     *     summary: Reach unprotected API endpoints
     *     description: An API endpoint for you to make sure you are reaching the server and its unprotected api endpoints (like /authenticate, etc.)
     *     tags: [Endpoints for Testing]
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: Returns an object
     *         schema:
     *           type: object
     *           properties:
     *             success:
     *               type: boolean
     *             message:
     *               type: string
     *               example: 'reached API!'
     *       500:
     *         description: server error
     *         schema:
     *           type: object
     *           $ref: '#/definitions/ServerError'
     * /v1/protected:
     *   get:
     *     summary: Reach protected API endpoints
     *     description: An API endpoint for you to make sure you are reaching the server and its protected api endpoints (like /collaborators, etc.)
     *     tags: [Endpoints for Testing]
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: Returns an object
     *         schema:
     *           type: object
     *           properties:
     *             success:
     *               type: boolean
     *             message:
     *               type: string
     *               example: 'reached protected API!'
     *       403:
     *         description: failed to authenticate the supplied token or no token was provided
     *         schema:
     *           type: object
     *           $ref: '#/definitions/FailedToken'
     *       500:
     *         description: server error
     *         schema:
     *           type: object
     *           $ref: '#/definitions/ServerError'
     */

    // return the /api/v1 routes object
    return apiRouter;
}

// export the apiRoutes object for consumption in other modules
exports.apiRoutes = apiRoutes;