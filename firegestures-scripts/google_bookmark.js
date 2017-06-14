/**
 * Add current url to Google Bookmarks.
 */

var title = encodeURIComponent(content.window.document.title);
var currentUrl = encodeURIComponent(content.window.location.href);
var style = 'centerscreen, chrome=yes, ' +
            'height=490px, width=560px, ' +
            'resizable=1, alwaysRaised=1';
var prefix = 'http://www.google.com/bookmarks/mark?op=edit&output=popup&bkmk=';
var openUrl = prefix + currentUrl + '&title=' + title;

FireGestures.setStatusText('Sending data to Google Bookmark...');
open(openUrl, 'bkmk_popup', style);
setTimeout(function() {
    document.focus();
}, 100);
