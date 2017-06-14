/**
 * Search image in Tineye.
 */

var prefix = 'http://www.tineye.com/search/?url=';
var imageUrl = FireGestures.getImageURL(FireGestures.sourceNode);
if (!imageUrl) { imageUrl = FireGestures.getImageURL(event.target); }
if (!imageUrl) { imageUrl = content.window.location.href; }

var openUrl = prefix + encodeURIComponent(imageUrl);
gBrowser.loadOneTab(openUrl);
