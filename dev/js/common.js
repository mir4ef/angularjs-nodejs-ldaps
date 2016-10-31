/**
 * @file common.js This file handles all the custom JavaScript actions.
 * @author Miroslav Georgiev
 * @version 0.0.1
 */

/**
 * @description Logic to be executed as soon as the document finished loading all the resources for the page
 * @function
 */
window.onload = function () {
    'use strict';

    // Get and set the current year to fields requiring it like copyright, etc.
    // get the current UTC(GMT) year in a YYYY format
    var currentYear = new Date().getUTCFullYear();
    // get all fields that require the year
    var yearFields = document.querySelectorAll('.current-year');

    // loop through all fields and assign the year
    for (var i = yearFields.length; i--;) {
        yearFields[i].textContent = currentYear;
    }
};