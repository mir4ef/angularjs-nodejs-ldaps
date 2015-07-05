'use strict';

describe('AngularJS/NodeJS LDAPS App', function () {
    var username = element(by.model('login.loginData.username'));
    var password = element(by.model('login.loginData.password'));
    var goButton = element(by.css('button[type=submit]'));
    
    beforeEach(function () {
        browser.get('/');
    });

    // make sure the app has a title
    it('should have a title', function () {
        expect(browser.getTitle()).toEqual('RGC AngularJS/NodeJS LDAPS Demo');
    });

    // test default route
    it('should redirect index.html to /', function () {
        browser.getLocationAbsUrl().then(function (url) {
            expect(url).toBe('/');
        });
    });
    
    // test login route
    it('should go to login', function() {
        browser.get('/login');
        browser.getLocationAbsUrl().then(function (url) {
            expect(url).toBe('/login');
        });
    });

    // test successful login
    it('should ensure user can login', function () {
        browser.get('/login');
        browser.getLocationAbsUrl().then(function (url) {
            expect(url).toBe('/login');
        });

        username.sendKeys('svc.Rgceve');
        password.sendKeys('Regener0n9!4');
        goButton.click();

        browser.getLocationAbsUrl().then(function (url) {
            expect(url).toBe('/home');
        });
        expect(element(by.css('span.bold')).getText()).toEqual('svc.Rgceve');
    });
    
    // test failed login
    it('should keep invalid lgins on this page', function () {
        browser.get('/login');
        browser.getLocationAbsUrl().then(function (url) {
            expect(url).toBe('/login');
        });
        
        username.sendKeys('fake.user');
        password.sendKeys('password');
        goButton.click();
        
        expect(element(by.css('.err-message.bold')).getText()).toContain('failed');
        
        browser.getLocationAbsUrl().then(function (url) {
            expect(url).toBe('/login');
        });
    });
});