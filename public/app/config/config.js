/**
 * @file config.js contains global application configurations
 * @extends appname
 * @author Miroslav Georgiev
 * @version 1.0.0
 * @package app.config
 */

(function () {
    'use strict';

    /**
     * @ngdoc config
     * @memberOf appname
     * @type {{version: string, debugMode: boolean, testMode: boolean, legacyMode: boolean, templatePrefix: string}}
     */
    var config = {
        /**
         * @summary SITE VERSION
         * @description Sets the site version to be used when storing content in localStorage to enable versioning/updating
         */
        version: '0.3.2',

        /**
         * @summary DEBUG MODE
         * @description When true, debug features will be enabled
         */
        debugMode: false,

        /**
         * @summary TEST MODE
         * @description Set to true for running unit tests
         */
        testMode: false,

        /**
         * @summary LEGACY MODE
         * @description Set to true for deprecated legacy `success` and `error` methods
         */
        legacyMode: false,

        /**
         * @summary TEMPLATE PREFIX
         * @description Prefix for the html files for cache busting
         */
        templatePrefix: ''
    };

    angular.module('appname').constant('config', config);
})();