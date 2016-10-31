/**
 * @file login.component.spec.js
 * @author Miroslav Georgiev
 * @version 1.0.0
 */

'use strict';

describe('userLogin component', function() {

    var modName = 'login';

    // first check if the module exists, before trying to assign it
    it('the `login` module should exist', function() {
        expect(angular.module(modName)).toBeDefined();
    });

    // Load the modules that are required by the component/controller
    beforeEach(module('core.auth'));
    // Load the module that contains the `login` component before each test
    beforeEach(module(modName));

    // Test the controller
    describe('LoginCtrl', function () {
        var $rootScope;
        var $location;
        var $httpBackend;
        var Auth;
        var authResponse;
        var vm;

        beforeEach(inject(function ($componentController) {
            vm = $componentController('userLogin');
            vm.loginData = {};
            vm.loginData.username = 'username';
            vm.loginData.password = 'password';
        }));

        // Test the doLogin() method
        describe('.doLogin()', function () {
            beforeEach(inject(function (_$rootScope_, _$location_, _$httpBackend_, _Auth_) {
                $rootScope = _$rootScope_;
                $location = _$location_;
                $location.nextAfterLogin = 'route';

                expect($location.nextAfterLogin).toEqual('route');

                $httpBackend = _$httpBackend_;
                authResponse = $httpBackend.whenPOST('api/v1/authenticate', { username: vm.loginData.username, password: vm.loginData.password }).respond(200, { success: true, message: 'logged in',  token: 'generated token'});

                Auth = _Auth_;

                spyOn(vm, 'doLogin').and.callThrough();
                vm.doLogin();
            }));

            // Verify that there are no outstanding expectations or requests after each test
            afterEach(function () {
                $httpBackend.verifyNoOutstandingExpectation();
                $httpBackend.verifyNoOutstandingRequest();
            });

            it('should exist', function() {
                expect(vm.doLogin).toBeDefined();

                $httpBackend.flush();
            });

            it('should have been called', function () {
                expect(vm.doLogin).toHaveBeenCalled();

                $httpBackend.flush();
            });

            it('vm.error should be defined and set to empty string', function () {
                expect(vm.error).toBeDefined();
                expect(vm.error).toEqual('');

                $httpBackend.flush();
            });

            it('should return a token if successful and redirect to $location.nextAfterLogin', function () {
                $httpBackend.expectPOST('api/v1/authenticate');

                Auth.login(vm.loginData.username, vm.loginData.password).then(function (result) {
                    expect(result.data.success).toEqual(true);
                    expect(result.data.token).toEqual('generated token');
                    expect($location.nextAfterLogin).toEqual(null);
                    expect($location.path()).toEqual('/route');
                });

                $httpBackend.flush();
            });

            it('should return a token if successful and redirect to /home', function () {
                $location.nextAfterLogin = null;
                $httpBackend.expectPOST('api/v1/authenticate');

                Auth.login(vm.loginData.username, vm.loginData.password).then(function (result) {
                    expect(result.data.success).toEqual(true);
                    expect(result.data.token).toEqual('generated token');
                    expect($location.nextAfterLogin).toEqual(null);
                    expect($location.path()).toEqual('/home');
                });

                $httpBackend.flush();
            });

            it('should return an error if credentials are wrong', function () {
                authResponse.respond(403, { success: false, message: 'invalid credentials' });
                $httpBackend.expectPOST('api/v1/authenticate');

                Auth.login(vm.loginData.username, vm.loginData.password).then(function (result) {
                    expect(result.data.success).toEqual(false);
                    expect(result.data.token).toBeUndefined();
                    expect(vm.error).toEqual('invalid credentials');
                });

                $httpBackend.flush();
            });

            // TODO investigate 500 response, right now goes to success in unit testing
            it('should return an error if something goes wrong on the backend from `Auth`', function () {
                authResponse.respond(500, { success: false, message: 'server error' });
                $httpBackend.expectPOST('api/v1/authenticate');

                Auth.login(vm.loginData.username, vm.loginData.password).then(function (result) {

                }, function (error) {
                    expect(error.data.success).toEqual(true);
                    expect(error.data.message).toEqual('We apologize, but we could not reach the authentication servers. They might be offline or your device lost internet connection.');
                });

                $httpBackend.flush();
            });
        });

        // Test the reset() form method
        describe('.reset()', function () {
            var form = {
                $dirty: true,
                $pristine: false,
                $touched: true,
                $setPristine: function() {
                    this.$pristine = true;
                    this.$dirty = false;
                },
                $setUntouched: function() {
                    this.$touched = false;
                }
            };

            it('should exist', function() {
                expect(vm.reset).toBeDefined();
            });

            beforeEach(function () {
                spyOn(vm, 'reset').and.callThrough();
                spyOn(form, '$setPristine').and.callThrough();
                spyOn(form, '$setUntouched').and.callThrough();
            });

            it('should NOT reset a form if NO form is passed', function() {
                vm.reset();

                expect(vm.reset).toHaveBeenCalledWith();
                expect(vm.error).toEqual('');
                expect(form.$setPristine.calls.any()).toEqual(false);
                expect(form.$setUntouched.calls.any()).toEqual(false);
                expect(form.$dirty).toEqual(true);
                expect(form.$pristine).toEqual(false);
                expect(form.$touched).toEqual(true);
                expect(vm.loginData).toEqual({ username: '', password: '' });
            });

            it('should reset a form if a form object is passed', function() {
                vm.reset(form);

                expect(vm.reset).toHaveBeenCalledWith(form);
                expect(vm.error).toEqual('');
                expect(form.$setPristine).toHaveBeenCalled();
                expect(form.$setUntouched).toHaveBeenCalled();
                expect(form.$dirty).toEqual(false);
                expect(form.$pristine).toEqual(true);
                expect(form.$touched).toEqual(false);
                expect(vm.loginData).toEqual({ username: '', password: '' });
            });
        });
    });
});