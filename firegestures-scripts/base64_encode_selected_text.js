/**
 * Base64 encode selected text.
 */

var encode = function(text) {
    return btoa(unescape(encodeURIComponent(text)));
};

var text = FireGestures.getSelectedText();
if (text) {
    alert(encode(text));
} else {
    FireGestures.setStatusText('No selected text to encode.');
}
