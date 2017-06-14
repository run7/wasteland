/**
 * View current feed page in Google Reader.
 */

var currentUrl = content.window.location.href;
var prefix = 'http://www.google.com/reader/atom/feed/';
var isChanged = currentUrl.indexOf(prefix) !== -1;

var openUrl;
if (isChanged) {
    openUrl = decodeURIComponent(currentUrl.replace(prefix, '')
                                           .replace(/\?n=.+$/, ''))
              .replace('http', 'feed');
} else {
    openUrl = prefix.replace('http', 'feed') +
              encodeURIComponent(currentUrl) +
              '?n=100';
}
gBrowser.loadURI(openUrl);
