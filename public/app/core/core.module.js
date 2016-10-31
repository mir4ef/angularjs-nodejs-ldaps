/**
 * @file core.module.js
 * @module core
 * @author Miroslav Georgiev
 * @version 0.0.1
 */

(function () {
    'use strict';

    angular.module('core', [
        'core.clearcache',
        'core.localstorage',
        'core.auth'
    ]);
})();