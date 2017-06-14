/**
 * URI decode selected text.
 */

var text = FireGestures.getSelectedText();
if (text) {
    alert(decodeURIComponent(text));
} else {
    FireGestures.setStatusText('No selected text to decode.');
}
