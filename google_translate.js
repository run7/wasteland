/**
 * View current page in Google Translate.
 */

var LANG = 'zh-CN';

var currentUrl = content.window.location.href;
var prefix = 'http://translate.google.com/translate?sl=auto';
var isChanged = currentUrl.indexOf(prefix) !== -1;

var openUrl;
if (isChanged) {
    openUrl = decodeURIComponent(currentUrl.match(/u=(.+?)$/)[1]);
} else {
    openUrl = prefix + '&tl=' + LANG + '&u=' + encodeURIComponent(currentUrl);
}
gBrowser.loadURI(openUrl);
