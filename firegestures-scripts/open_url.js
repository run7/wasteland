/**
 * Open url.
 */

var URL = 'http://www.google.com/';
var NEW_TAB = true;
var BACKGROUND = false;

if (NEW_TAB) {
    gBrowser.loadOneTab(URL, {inBackground: BACKGROUND});
} else {
    gBrowser.loadURI(URL);
}
