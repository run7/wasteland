/**
 * Allow input textfield paste/copy/cut.
 */

var removeLimitation = function(doc) {
    var nodes = doc.querySelectorAll('input');
    var i, node;
    for (i = 0; i < nodes.length; i += 1) {
        node = nodes[i];
        node.removeAttribute('onpaste');
        node.removeAttribute('oncopy');
        node.removeAttribute('oncut');
    }
};

var mainDoc = content.window.document;
removeLimitation(mainDoc);

var frameDocs = mainDoc.querySelectorAll('iframe');
var i, frameDoc;
for (i = 0; i < frameDocs.length; i += 1) {
    frameDoc = frameDocs[i];
    removeLimitation(frameDoc.contentWindow.document);
}

FireGestures.setStatusText('You can paste/copy/cut in textfield now.');
