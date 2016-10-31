/**
 * @file login.component.js
 * @description This file handles the login logic for the entire application
 * @extends login
 * @author Miroslav Georgiev
 * @version 1.0.0
 */

(function () {
    'use strict';

    /**
     * @ngdoc controller
     * @memberOf login
     *
     * @description LoginCtrl handles /login route logic
     * @param $location
     * @param Auth
     * @constructor
     */
    function LoginCtrl($location, Auth) {
        var vm = this;

        /**
         * @method doLogin
         * @memberOf LoginCtrl
         * @summary Handle the login process
         * @description Method to perform the user login and authentication
         */
        function doLogin() {
            vm.processing = true;
            vm.error = '';

            Auth.login(vm.loginData.username, vm.loginData.password).then(function (result) {
                vm.processing = false;
                if (result.data) {
                    if (result.data.success) {
                        var next = $location.nextAfterLogin || '/home';

                        $location.nextAfterLogin = null;
                        $location.path(next);
                    }
                    else {
                        vm.error = result.data.message;
                    }
                } else {
                    vm.error = 'We apologize, but something went wrong on the server side. Please try again or contact the application owner.';
                }
            }, function (error) {
                vm.processing = false;
                vm.error = 'We apologize, but we could not reach the authentication servers. They might be offline or your device lost internet connection.';
            });
        }

        /**
         * @method resetLoginForm
         * @memberOf LoginCtrl
         * @summary Reset a form and set variables to default values
         * @description Reset the passed form and set it to pristine and untouched and set variables to default values
         * @param {Object} form - the form element object
         */
        function resetLoginForm(form) {
            vm.error = '';
            vm.loginData = { username: '', password: '' };

            if (form) {
                form.$setPristine();
                form.$setUntouched();
            }
        }

        vm.doLogin = doLogin;
        vm.reset = resetLoginForm;
    }

    /**
     * @ngdoc component
     * @name userLogin
     * @memberOf login
     * @description Object containing the options for the `login` component
     */
    var userLogin = {
        templateUrl: 'app/login/login.view.html',
        controller: 'LoginCtrl as login'
    };

    angular.module('login').controller('LoginCtrl', LoginCtrl);
    angular.module('login').component('userLogin', userLogin);
})();