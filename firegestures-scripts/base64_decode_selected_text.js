/**
 * Base64 decode selected text.
 */

var decode = function(text) {
    return decodeURIComponent(escape(atob(text)));
};

var text = FireGestures.getSelectedText();
if (text) {
    alert(decode(text));
} else {
    FireGestures.setStatusText('No selected text to decode.');
}
