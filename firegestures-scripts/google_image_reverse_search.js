/*
 * Google Image search by an image.
 */

var prefix = 'https://www.google.com/searchbyimage?image_url=';
var imageUrl = FireGestures.getImageURL(FireGestures.sourceNode);
if (!imageUrl) { imageUrl = FireGestures.getImageURL(event.target); }
if (!imageUrl) { imageUrl = content.window.location.href; }

var openUrl = prefix + encodeURIComponent(imageUrl);
gBrowser.loadOneTab(openUrl);
