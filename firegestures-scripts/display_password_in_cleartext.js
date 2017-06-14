/**
 * Display password textfield in cleartext.
 */

var makeCleartext = function(doc) {
    var nodes = doc.querySelectorAll('input');
    var i, node;
    for (i = 0; i < nodes.length; i += 1) {
        node = nodes[i];
        if (node.type === 'password') {
            node.type = 'text';
        }
    }
};

var mainDoc = content.window.document;
makeCleartext(mainDoc);

var frameDocs = mainDoc.querySelectorAll('iframe');
var i, frameDoc;
for (i = 0; i < frameDocs.length; i += 1) {
    frameDoc = frameDocs[i];
    makeCleartext(frameDoc.contentWindow.document);
}
