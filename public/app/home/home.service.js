/**
 * @file home.service.js
 * @description This file contains services for the home page
 * @extends home
 * @author Miroslav Georgiev
 * @version 1.0.0
 */

(function () {
    'use strict';

    /**
     * @ngdoc factory
     * @memberOf home
     *
     * @description Service to get home page data
     * @param {Object} $resource
     * @returns {Promise}
     * @constructor
     */
    function SomeService($resource) {
        return $resource('api/v1/someroute', {}, { get: { cache: true }});
    }

    angular.module('home').factory('SomeService', SomeService);
})();