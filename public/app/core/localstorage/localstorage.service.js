/**
 * @file localstorage.service.js
 * @extends core.localstorage
 * @author Miroslav Georgiev
 * @version 1.0.0
 */

(function () {
    'use strict';

    /**
     * @ngdoc factory
     * @name LocStorage
     * @memberOf core.localstorage
     * @description Handle saving and retrieving from localStorage
     * @param $window
     * @param {Object} config
     * @returns {Object}
     * @constructor
     */
    function LocStorage ($window, config) {
        /**
         * @member currentDay
         * @memberOf LocStorage
         * @description Get the current UTC(GMT) day in the current UTC(GMT) month
         * @type {Number}
         */
        var currentDay = new Date().getUTCDate();

        /**
         * @member currentMonth
         * @memberOf LocStorage
         * @description Get the current UTC(GMT) month
         * @type {Number}
         */
        var currentMonth = new Date().getUTCMonth();

        /**
         * @member currentYear
         * @memberOf LocStorage
         * @description Get the current UTC(GMT) year in a YYYY format
         * @type {Number}
         */
        var currentYear = new Date().getUTCFullYear();

        /**
         * @member todayDate
         * @memberOf LocStorage
         * @description Today's date in UTC format
         * @type {Date}
         */
        var todayDate = new Date(Date.UTC(currentYear, currentMonth, currentDay));
        var storage = {};

        /**
         * @method addDays
         * @memberOf LocStorage
         * @description calculates a new date based on date passed and span (in days)
         * @param {Date} date
         * @param {Number} days
         * @returns {Date}
         */
        function addDays (date, days) {
            var newDate = new Date(date);
            newDate.setDate(date.getDate() + days);

            return newDate;
        }

        /**
         * @method saveToStorage
         * @memberOf LocStorage
         * @description Save value to localStorage
         * @param {String} key - The key which the data will be saved under
         * @param {*} value - The value that will be saved to localStorage
         */
        storage.saveToStorage = function (key, value) {
            if (key && value) {
                var objForStorage = {
                    'data': value,
                    'saveDate': todayDate,
                    'version': config.version
                };

                try {
                    $window.localStorage[key] = angular.toJson(objForStorage);
                }
                catch (e) {
                    console.error('Could not save data to localStorage! Error:', e);
                }
            }
        };

        /**
         * @method isSaved
         * @memberOf LocStorage
         * @description Check if there is value saved for the given key and that it is not too old
         * @param {String} key
         * @returns {Boolean}
         */
        storage.isSaved = function (key) {
            if ($window.localStorage[key]) {
                var data = angular.fromJson($window.localStorage[key]);

                // first check the version to make sure the stored content is the latest one
                if (config.version !== data.version) {
                    return false;
                }

                // check the save date to make sure it is not too old
                var savedDate = new Date(data.saveDate);
                savedDate = addDays(savedDate, 15);

                return todayDate < savedDate;
            }

            return false;
        };

        /**
         * @method getFromStorage
         * @memberOf LocStorage
         * @description retrieve a saved value
         * @param {String} key
         * @returns {Object|Boolean}
         */
        storage.getFromStorage = function (key) {
            if ($window.localStorage[key]) {
                return angular.fromJson($window.localStorage[key]);
            }

            return false;
        };

        /**
         * @method getFromStorage
         * @memberOf LocStorage
         * @description deletes a value from localStorage
         * @param {String} key
         */
        storage.deleteValue = function (key) {
            if ($window.localStorage[key]) {
                $window.localStorage.removeItem(key);
            }
        };

        /**
         * @method deleteStorage
         * @memberOf LocStorage
         * @description deletes the entire localStorage (use carefully!!!)
         */
        storage.deleteStorage = function () {
            $window.localStorage.clear();
        };

        return storage;
    }

    angular.module('core.localstorage').factory('LocStorage', LocStorage);
})();