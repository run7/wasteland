/**
 * View current page in Internet Archive.
 */

var currentUrl = content.window.location.href;
var prefix = 'http://web.archive.org/web/';
var isChanged = currentUrl.indexOf(prefix) !== -1;

var openUrl;
if (isChanged) {
    openUrl = currentUrl.match(/web.archive.org\/web\/.+?\/(.+?)$/)[1];
} else {
    openUrl = prefix + '*/' + currentUrl;
}
gBrowser.loadURI(openUrl);
