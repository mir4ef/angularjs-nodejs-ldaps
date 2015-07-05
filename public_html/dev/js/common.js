// Miroslav Georgiev
'use strict';

// get and set the current year to fields requiring it like copyright, etc.
var currentYear = new Date().getUTCFullYear(); // get the current UTC(GMT) year in a YYYY format
var yearFields = document.getElementsByClassName('current-year'); // get all fields that require the year
// loop through all fields and assign the year
for (var i = yearFields.length; i--; )
    yearFields[i].textContent = currentYear;