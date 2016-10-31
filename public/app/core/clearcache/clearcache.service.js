/**
 * @file clearcache.js
 * @extends core.clearcache
 * @author Miroslav Georgiev
 * @version 1.0.0
 */

(function () {
    'use strict';

    /**
     * @ngdoc factory
     * @name ClearCache
     * @memberOf core.clearcache
     * @description Handler to clear angular's $http cache
     * @param {Object} $cacheFactory
     * @returns {Object}
     * @constructor
     */
    function ClearCache ($cacheFactory) {
        var cache = {};

        /**
         * @method removeItem
         * @memberOf ClearCache
         * @param {String} key - The key for the object that needs to be removed from the cahceFactory
         */
        cache.removeItem = function (key) {
            if (key) {
                $cacheFactory.get('$http').remove(key);
            }
        };

        return cache;
    }

    angular.module('core.clearcache').factory('ClearCache', ClearCache);
})();