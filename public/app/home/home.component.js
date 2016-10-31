/**
 * @file home.component.js
 * @description This file handles the logic for the home page of the application
 * @extends home
 * @author Miroslav Georgiev
 * @version 0.0.1
 */

(function () {
    'use strict';

    /**
     * @ngdoc controller
     * @name HomeCtrl
     * @memberOf home
     *
     * @description HomeCtrl handles /home route logic
     * @param SomeService
     * @constructor
     */
    function HomeCtrl (SomeService) {
        var vm = this;

        /**
         * @method handleInit
         * @memberOf HomeCtrl
         * @description Method to initialize the home component, define and set default values
         */
        function handleInit() {

        }

        vm.$onInit = handleInit;
    }

    /**
     * @ngdoc component
     * @name homeView
     * @memberOf home
     * @description Object containing the options for the `home` component
     */
    var homeView = {
        templateUrl: 'app/home/home.view.html',
        controller: 'HomeCtrl as home'
    };

    // we need to inject the controller, because of strict DI
    angular.module('home').controller('HomeCtrl', HomeCtrl);
    angular.module('home').component('homeView', homeView);
})();