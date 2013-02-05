/**
 * Search current site with Google.
 */

var text = FireGestures.getSelectedText();
if (!text) { text = prompt('Search'); }

var searchString, url;
if (text !== null && text !== '') {
    searchString = text + ' site:' + content.window.location.hostname;
    url = 'http://www.google.com/search?q=' + encodeURIComponent(searchString);
    gBrowser.loadOneTab(url, {inBackground: false});
}
