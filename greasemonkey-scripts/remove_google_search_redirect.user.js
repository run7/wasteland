// ==UserScript==
// @name        Remove Google Search Redirect
// @description Remove Google Search annoying redirect
// @grant       none
// @include     http://www.google.*/*
// @include     https://www.google.*/*
// ==/UserScript==

window.addEventListener('load', function() {
    window.rwt = function() {};
});
