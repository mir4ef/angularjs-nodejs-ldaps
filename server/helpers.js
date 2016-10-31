/**
 * @file helpers.js Server side helper functions
 * @author Miroslav Georgiev
 * @version 0.0.1
 */
'use strict';

/**
 * @description Handler to set the headers to handle CORS requests
 * @param {Object} req The request object
 * @param {Object} res The response object
 * @param next
 */
exports.handleCORS = (req, res, next) => {
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type, Authentication');
    next();
};

/**
 * @description Handler for all application level errors and returns a json with the error message to the caller
 * @param {String} message The error message to be returned with the response
 * @param {Number} code The error code for the server response
 * @param {Object} req The request object
 * @param {Object} res The response object
 * @param {Object|Function} next The call back function to allow the application to continue
 * @returns {Object} Object containing the error message
 */
exports.handleErrors = ({ message = 'An error occurred', code = 500 }, req, res, next) => res.status(code).json({ success: false, message: message });

/**
 * @description Handler for HTTP request to redirect them to HTTPS
 * @param {Object} req The request object
 * @param {Object} res The response object
 * @param {Object|Function} next The call back function to allow the application to continue
 */
exports.redirectToHTTPS = (req, res, next) => {
    if (!req.secure) {
        // request was via http, so redirect to https
        return res.redirect('https://' + req.headers.host + req.url);
    }

    // request was via https, so do no special handling
    next();
};

/**
 * @description Safely escape characters during replace or other RegEx methods
 * @param {String} str
 * @returns {String}
 */
exports.escapeRegExp = str => str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$&");