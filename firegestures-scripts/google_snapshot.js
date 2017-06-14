/**
 * View current page in Google Snapshot.
 */

var currentUrl = content.window.location.href;
var prefix = 'https://webcache.googleusercontent.com/search?q=cache:';
var selectedText = FireGestures.getSelectedText();
var isChanged = currentUrl.indexOf(prefix) !== -1;

var openUrl;
if (isChanged) {
    openUrl = decodeURIComponent(currentUrl.replace(prefix, ''));
    openUrl = openUrl.replace(/\+.*$/, ''); // remove hightlight keyword
} else {
    openUrl = prefix + encodeURIComponent(currentUrl);
    // add hightlight keyword
    if (selectedText) { openUrl += '+' + selectedText; }
}
gBrowser.loadURI(openUrl);
